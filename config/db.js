import { connect } from 'mongoose'

export default async function connectDB() {
    try {
        await connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        })
        console.log('MongoDB connected')
    } catch (err) {
        console.log(err.message)
    }
}