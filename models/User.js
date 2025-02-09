import { model, Schema } from "mongoose"

const userSchema = new Schema({
    fullName: { type: String },
    email: { type: String },
    password: { type: String },
    phone: { type: String },
    role: { type: String, enum: ['user', 'admin'] }
})

export default model('User', userSchema)