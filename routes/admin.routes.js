import { Router } from "express"
import { isAdmin, verifyToken } from "../middlewares/auth.middleware.js"
import {
    allJobs, 
    addJobForm,
    addJob,
    editJobForm,
    editJob,
    deleteJob,
    allApliedsJob,
    changeStatus,
    apliedJobDetail,
    dashboard,
    users
} from '../controllers/admin.controller.js'
const router = Router()

// jobs management
router.get('/dashboard', verifyToken, isAdmin, dashboard)
router.get('/jobs', verifyToken, isAdmin, allJobs)
router.get('/jobs/add', verifyToken, isAdmin, addJobForm)
router.post('/jobs/add', verifyToken, isAdmin, addJob)
router.get('/jobs/edit/:id', verifyToken, isAdmin, editJobForm)
router.post('/jobs/edit/:id', verifyToken, isAdmin, editJob)
router.post('/jobs/delete/:id', verifyToken, isAdmin, deleteJob)
router.get('/jobs/applied', verifyToken, isAdmin, allApliedsJob)
router.get('/jobs/applied/:id', verifyToken, isAdmin, apliedJobDetail)
router.post('/jobs/applied/:id', verifyToken, isAdmin, changeStatus)
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import fs from 'fs'
router.get('/resume/download/:filename', (req, res) => {
    const filename = decodeURIComponent(req.params.filename)
    const filePath = path.join(__dirname, '..', 'uploads', filename)  // Adjust the path

    console.log("File Path:", filePath)

    // Check if the file exists before attempting to download
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error("File does not exist:", filePath)
            return res.status(404).send("File not found")
        }

        res.download(filePath, filename, (err) => {
            if (err) {
                console.error('Download error:', err)
                if (!res.headersSent) {
                    res.status(500).send('Error during download.')
                }
            }
        })
    })
})
router.get('/users', verifyToken, isAdmin, users)

export default router