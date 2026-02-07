import { z } from 'zod';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import connectDB from './db';
import JobOffer from './models/JobOffer';
import Application from './models/Application';
import { signToken, verifyToken } from './auth';
import { randomUUID } from 'crypto';

// --- Configuration & Helpers ---

const ADMIN_USER = import.meta.env.ADMIN_DASHBOARD_USER;
const ADMIN_PASS = import.meta.env.ADMIN_DASHBOARD_PASSWORD;

// MinIO / S3 Client Setup
const s3Client = new S3Client({
    region: import.meta.env.S3_REGION || 'us-east-1',
    endpoint: import.meta.env.S3_ENDPOINT, // Optional if using AWS S3
    credentials: {
        accessKeyId: import.meta.env.S3_ACCESS_KEY || '',
        secretAccessKey: import.meta.env.S3_SECRET_KEY || '',
    },
    forcePathStyle: true, // Required for MinIO, optional for AWS but often harmless
});

const BUCKET_NAME = import.meta.env.S3_BUCKET_NAME || 'cv-uploads';

// Slug Generator Helper
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + randomUUID().split('-')[0];
}

// --- Zod Schemas ---

const JobOfferSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    requirements: z.array(z.string()).default([]),
    location: z.string().optional(),
    salaryMin: z.number().optional(),
    salaryMax: z.number().optional(),
    status: z.enum(['draft', 'active', 'closed']).default('draft'),
    vacancies: z.number().optional(),
});

const ApplicationSchema = z.object({
    candidateName: z.string().min(2),
    candidateEmail: z.string().email(),
    coverLetter: z.string().optional(),
    gdprConsent: z.boolean().refine((val) => val === true, {
        message: "You must accept the privacy policy",
    }),
    incorporation: z.enum(["inmediata", "15_dias", "1_mes", "other"]),
    hasVehicle: z.boolean(),
    trainingInterest: z.boolean(),
});

// --- Actions ---

/**
 * Admin Action: Login
 */
export async function loginAdmin(user: string, pass: string) {
    // 1. Check Credentials
    if (user !== ADMIN_USER || pass !== ADMIN_PASS) {
        throw new Error('Unauthorized: Invalid Admin Credentials');
    }

    // 2. Generate Token
    const token = signToken({ role: 'admin' });
    return { success: true, token };
}

/**
 * Admin Action: Create a new Job Offer
 */
export async function createJobOffer(data: z.infer<typeof JobOfferSchema>, token: string) {
    await connectDB();

    // 1. Verify Token
    if (!verifyToken(token)) {
        throw new Error('Unauthorized: Invalid Token');
    }

    // 2. Validation
    const validated = JobOfferSchema.parse(data);

    // 3. Create Slug
    const slug = generateSlug(validated.title);

    // 4. Save to DB
    const job = await JobOffer.create({
        ...validated,
        slug,
    });

    return job.toObject();
}

/**
export async function updateJobOffer(id: string, data: Partial<z.infer<typeof JobOfferSchema>>, token: string) {
    await connectDB();

    // 1. Verify Token
    if (!verifyToken(token)) {
        throw new Error('Unauthorized: Invalid Token');
    }

    // 2. Validation (Partial)
    // z.infer<typeof JobOfferSchema> returns expected shape, .partial() makes all optional
    const validData = JobOfferSchema.partial().parse(data);

    // 3. Update in DB
    const updated = await JobOffer.findByIdAndUpdate(id, validData, { new: true });

    if (!updated) {
        throw new Error('Job Offer not found');
    }

    return updated.toObject();
}

/**
 * Admin Action: Delete a Job Offer
 */
export async function deleteJobOffer(id: string, token: string) {
    await connectDB();

    // 1. Verify Token
    if (!verifyToken(token)) {
        throw new Error('Unauthorized: Invalid Token');
    }

    // 2. Delete
    const deleted = await JobOffer.findByIdAndDelete(id);

    if (!deleted) {
        throw new Error('Job Offer not found');
    }

    return { success: true };
}


/**
 * Public Action: Submit an Application
 */
export async function submitApplication(formData: FormData, jobOfferId: string) {
    await connectDB();

    const name = formData.get('candidateName') as string;
    const email = formData.get('candidateEmail') as string;
    const coverLetter = formData.get('coverLetter') as string;
    const cvFile = formData.get('cv') as File;
    const gdprConsent = formData.get('gdprConsent') === 'on';
    const incorporation = formData.get('incorporation') as any;
    const hasVehicle = formData.get('hasVehicle') === 'true'; // expects radio with value "true"
    const trainingInterest = formData.get('trainingInterest') === 'on'; // check box

    // 1. Validate Input
    const validated = ApplicationSchema.parse({
        candidateName: name,
        candidateEmail: email,
        coverLetter,
        gdprConsent,
        incorporation,
        hasVehicle, // If it's a radio group returning "true"/"false" strings, we need to convert.
        trainingInterest,
    });

    if (!cvFile || cvFile.size === 0) {
        throw new Error('CV file is required');
    }

    // 2. Validate Job Offer
    const offer = await JobOffer.findById(jobOfferId);
    if (!offer) {
        throw new Error('Job Offer not found');
    }
    if (offer.status !== 'active') {
        throw new Error('This job offer is no longer accepting applications');
    }

    // 3. Check Duplicate Application
    const existingApp = await Application.findOne({
        jobOfferId: offer._id,
        candidateEmail: validated.candidateEmail,
    });
    if (existingApp) {
        throw new Error('You have already applied to this position.');
    }

    // 4. Upload to MinIO/S3
    const fileBuffer = Buffer.from(await cvFile.arrayBuffer());
    const fileKey = `cvs/${offer.slug}/${Date.now()}-${cvFile.name}`;

    await s3Client.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: cvFile.type,
    }));


    // Construct URL based on whether we have a custom endpoint (MinIO) or standard AWS S3
    let cvUrl = '';
    if (process.env.S3_ENDPOINT) {
        cvUrl = `${process.env.S3_ENDPOINT}/${BUCKET_NAME}/${fileKey}`;
    } else {
        // Standard AWS S3 URL format: https://<bucket>.s3.<region>.amazonaws.com/<key>
        cvUrl = `https://${BUCKET_NAME}.s3.${process.env.S3_REGION || 'us-east-1'}.amazonaws.com/${fileKey}`;
    }

    // 5. Persist Application
    const application = await Application.create({
        jobOfferId: offer._id,
        candidateName: validated.candidateName,
        candidateEmail: validated.candidateEmail,
        cvUrl: cvUrl,
        coverLetter: validated.coverLetter,
        status: 'pending',
        gdprConsent: validated.gdprConsent,
        gdprConsentDate: new Date(),
        incorporation: validated.incorporation,
        hasVehicle: validated.hasVehicle,
        trainingInterest: validated.trainingInterest,
    });

    return { success: true, applicationId: application._id };
}


/**
 * Admin Action: Get Dashboard Stats with Pagination
 */
export async function getJobOffersWithStats(token: string, page: number = 1, limit: number = 10) {
    await connectDB();

    if (!verifyToken(token)) throw new Error('Unauthorized: Invalid Token');

    const skip = (page - 1) * limit;

    const pipeline = [
        { $match: {} },
        {
            $lookup: {
                from: 'applications',
                localField: '_id',
                foreignField: 'jobOfferId',
                as: 'applications'
            }
        },
        {
            $project: {
                title: 1,
                description: 1,
                status: 1,
                createdAt: 1,
                totalApplications: { $size: "$applications" },
                pendingReview: {
                    $size: {
                        $filter: {
                            input: "$applications",
                            as: "app",
                            cond: { $eq: ["$$app.status", "pending"] }
                        }
                    }
                }
            }
        },
        { $sort: { createdAt: -1 } },
        {
            $facet: {
                metadata: [{ $count: "total" }],
                data: [{ $skip: skip }, { $limit: limit }]
            }
        }
    ];

    // @ts-ignore
    const result = await JobOffer.aggregate(pipeline);

    const total = result[0].metadata[0]?.total || 0;
    const data = result[0].data || [];

    return {
        data,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
}


/**
 * Public Action: Get Active Job Offers
 */
export async function getActiveJobOffers() {
    await connectDB();
    const offers = await JobOffer.find({ status: 'active' })
        .select('title description location salaryMin salaryMax slug createdAt requirements vacancies')
        .sort({ createdAt: -1 });
    return offers;
}

/**
 * Public Action: Get Job Offer by Slug
 */
export async function getJobOfferBySlug(slug: string) {
    await connectDB();
    const offer = await JobOffer.findOne({ slug, status: 'active' });
    return offer;
}

import { ProjectAnalysis } from './models/ProjectAnalysis';

/**
 * Public Action: Submit Project Analysis
 */
export async function submitProjectAnalysis(formData: FormData) {
    await connectDB();

    const data = {
        contactEmail: formData.get('contactEmail'),
        contactPhone: formData.get('contactPhone'),
        queryType: formData.get('queryType'),
        isNewConstruction: formData.get('isNewConstruction') === 'true',
        projectTypeDetail: formData.get('projectTypeDetail'),
        location: formData.get('location'),
        analysisDetails: formData.get('analysisDetails'),
        sqMeters: Number(formData.get('sqMeters')),
        pricePerSqMeter: formData.get('pricePerSqMeter') ? Number(formData.get('pricePerSqMeter')) : undefined,
    };

    // Basic validation
    if (!data.contactEmail || !data.contactPhone || !data.projectTypeDetail || !data.location || !data.sqMeters) {
        throw new Error('Missing required fields');
    }

    const analysis = await ProjectAnalysis.create(data);
    return { success: true, id: analysis._id };
}

/**
 * Admin Action: Get Project Analyses with Pagination
 */
export async function getProjectAnalyses(token: string, page: number = 1, limit: number = 10) {
    await connectDB();

    if (!verifyToken(token)) throw new Error('Unauthorized');

    const skip = (page - 1) * limit;

    const total = await ProjectAnalysis.countDocuments();
    const analyses = await ProjectAnalysis.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return {
        data: analyses,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
}

/**
 * Admin Action: Delete Project Analysis
 */
export async function deleteProjectAnalysis(id: string, token: string) {
    await connectDB();
    if (!verifyToken(token)) throw new Error('Unauthorized');

    const deleted = await ProjectAnalysis.findByIdAndDelete(id);
    if (!deleted) throw new Error('Analysis not found');

    return { success: true };
}
