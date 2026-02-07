import mongoose from 'mongoose';

const ProjectAnalysisSchema = new mongoose.Schema({
    contactEmail: {
        type: String,
        required: true,
        trim: true,
    },
    contactPhone: {
        type: String,
        required: true,
        trim: true,
    },
    queryType: {
        type: String,
        required: true,
        enum: ['Analisis de Proyecto', 'Obra Nueva', 'Reformas'],
        default: 'Analisis de Proyecto'
    },
    isNewConstruction: {
        type: Boolean,
        default: false,
    },
    projectTypeDetail: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    analysisDetails: {
        type: String,
        trim: true
    },
    sqMeters: {
        type: Number,
        required: true,
    },
    pricePerSqMeter: {
        type: Number, // Optional, user might not know or it might be calculated
        required: false
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'contacted'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const ProjectAnalysis = mongoose.models.ProjectAnalysis || mongoose.model('ProjectAnalysis', ProjectAnalysisSchema);
