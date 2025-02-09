import { config } from 'dotenv'
import express from 'express'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import adminRoutes from './routes/admin.routes.js'
import userRoutes from './routes/user.routes.js'
import errorMiddleware from './middlewares/error.middleware.js'
import notFoundMiddleware from './middlewares/notFound.middleware.js'
import cookieParser from 'cookie-parser'
import expressEjsLayouts from 'express-ejs-layouts'
import fileUpload from 'express-fileupload'

config()
const app = express()

app.set('view engine', 'ejs')
app.use(expressEjsLayouts)
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(fileUpload())

app.use('/auth', authRoutes)
app.use('/admin', adminRoutes)
app.use(userRoutes)

// app.use(notFoundMiddleware)
// app.use(errorMiddleware)

app.listen(3000, () => console.log('http://localhost:3000'))
connectDB()