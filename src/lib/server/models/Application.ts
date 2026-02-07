import mongoose, { Schema, type Document, type Model, type Types } from 'mongoose';

export interface IApplication extends Document {
    jobOfferId: Types.ObjectId;
    candidateName: string;
    candidateEmail: string;
    cvUrl: string;
    coverLetter?: string;
    status: 'pending' | 'reviewed' | 'rejected' | 'hired';
    submittedAt: Date;
    gdprConsent: boolean;
    gdprConsentDate: Date;
    incorporation: string;
    hasVehicle: boolean;
    trainingInterest: boolean;
}

const ApplicationSchema = new Schema<IApplication>(
    {
        jobOfferId: { type: Schema.Types.ObjectId, ref: 'JobOffer', required: true, index: true },
        candidateName: { type: String, required: true },
        candidateEmail: { type: String, required: true },
        cvUrl: { type: String, required: true },
        coverLetter: { type: String },
        status: {
            type: String,
            enum: ['pending', 'reviewed', 'rejected', 'hired'],
            default: 'pending',
        },
        submittedAt: { type: Date, default: Date.now },
        gdprConsent: { type: Boolean, required: true },
        gdprConsentDate: { type: Date, default: Date.now },
        incorporation: { type: String, required: true }, // e.g. "Inmediata", "15 días"
        hasVehicle: { type: Boolean, required: true },
        trainingInterest: { type: Boolean, required: true }
    }
);

// Compound index to prevent duplicate applications for the same offer if desired,
// OR just to optimize looking up a specific candidate's application for an offer.
ApplicationSchema.index({ jobOfferId: 1, candidateEmail: 1 }, { unique: true });

// Prevent model recompilation error in dev mode
const Application: Model<IApplication> =
    mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);

export default Application;
