import { model, Schema, Types } from "mongoose"

const jobSchema = new Schema({
    company: { type: String },
    position: { type: String },
    location: { type: String },
    requirement: { type: String },
    workType: { type: String, enum: ['full-time', 'part-time', 'intership', 'contract'], default: 'full-time' },
    workLocation: { type: String, enum: ['in office', 'remote'], default: 'in office' },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true }
})

export default model('Jobs', jobSchema)