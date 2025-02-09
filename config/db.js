import { connect } from 'mongoose'

export default async function connectDB() {
    try {
        await connect('mongodb+srv://user:dbUserPassword@clusterr.vigdj.mongodb.net/', {
            serverSelectionTimeoutMS: 5000
        })
        console.log('MongoDB connected')
    } catch (err) {
        console.log(err.message)
    }
}