import { model, Schema, Types } from "mongoose"

const applySchema = new Schema({
    job: { type: Types.ObjectId, ref: 'Jobs', required: true },
    user: { type: Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['applied', 'reviewed', 'accepted', 'rejected'], default: 'applied' },
    resume: { type: String }, // URL atau path ke resume yang diunggah
    coverLetter: { type: String },
    appliedAt: { type: Date, default: Date.now }
})

export default model('Apply', applySchema)