import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IJobOffer extends Document {
    title: string;
    description: string;
    requirements: string[]; // List of requirements
    location?: string;
    salaryMin?: number;
    salaryMax?: number;
    status: 'draft' | 'active' | 'closed';
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    vacancies?: number;
}

const JobOfferSchema = new Schema<IJobOffer>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        requirements: { type: [String], default: [] },
        location: { type: String, required: false },
        salaryMin: { type: Number, required: false },
        salaryMax: { type: Number, required: false },
        status: {
            type: String,
            enum: ['draft', 'active', 'closed'],
            default: 'draft',
            index: true, // Filter active offers quickly
        },
        vacancies: { type: Number, required: false },
        slug: { type: String, required: true, unique: true, index: true },
    },
    {
        timestamps: true, // Auto-manage createdAt and updatedAt
    }
);

// Prevent model recompilation error in dev mode
const JobOffer: Model<IJobOffer> =
    mongoose.models.JobOffer || mongoose.model<IJobOffer>('JobOffer', JobOfferSchema);

export default JobOffer;
