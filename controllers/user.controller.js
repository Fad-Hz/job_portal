import Jobs from "../models/Jobs.js"
import Apply from "../models/Apply.js"

export const homePage = (req, res) => {
    res.render('user/home', {
        title: 'JobsEsc',
        layout: 'layouts/user',
        user: req.user.name
    })
}

export const allJobs = async (req, res) => {
    let jobs
    const searchQuery = req.query.q // Get the search query from the URL parameter

    if (searchQuery) {
        // Perform search based on the query (case-insensitive)
        jobs = await Jobs.find({
            $or: [ // Search in multiple fields
                { position: { $regex: searchQuery, $options: 'i' } }, // Search in position
                { company: { $regex: searchQuery, $options: 'i' } }, // Search in company
                { 'createdBy.name': { $regex: searchQuery, $options: 'i' } } // Search in createdBy's name
                // Add more fields as needed (e.g., description, location)
            ]
        }).populate('createdBy')
    } else {
        // If no search query, retrieve all jobs
        jobs = await Jobs.find().populate('createdBy')
    }

    res.render('user/jobs', {
        title: 'All Jobs',
        layout: 'layouts/user',
        jobs,
        searchQuery
    })
}

export const detailJob = async (req, res) => {
    const job = await Jobs.findById(req.params.id).populate('createdBy')
    res.render('user/job_detail', {
        title: 'Detail Job',
        layout: 'layouts/user',
        job
    })
}

export const applyJobForm = async (req, res) => {
    const { error, success } = req.query
    const job = await Jobs.findById(req.params.id)
    res.render('user/apply', {
        title: 'Apply Job',
        layout: 'layouts/user',
        error, success, job
    })
}

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const applyJob = async (req, res) => {
    const jobId = req.params.id // Pindahkan ke luar try agar tetap tersedia dalam catch

    try {
        const userId = req.user._id
        const { coverLetter } = req.body
        const resume = req.files?.resume

        if (!resume) {
            return res.redirect(`/jobs/apply/${jobId}?error=Resume file is required`)
        }

        // Tentukan direktori upload
        const uploadDir = path.join(__dirname, '..', 'uploads')

        // Pastikan direktori ada
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }

        // Tentukan path file yang akan disimpan
        const resumeName = `${Date.now()}-${resume.name}`
        const uploadPath = path.join(uploadDir, resumeName)

        // Pindahkan file ke folder uploads
        await resume.mv(uploadPath)

        await Apply.create({
            job: jobId,
            user: userId,
            resume: `uploads/${resumeName}`, // Simpan hanya relative path
            coverLetter
        })

        return res.redirect(`/jobs/apply/${jobId}?success=Berhasil apply job, tunggu gmail dari admin`)
    } catch (err) {
        console.error(err.stack)
        return res.redirect(`/jobs/apply/${jobId}?error=Something went wrong`)
    }
}

export const myApply = async (req, res) => {
    const applications = await Apply.find({ user: req.user._id }).populate('job')
    res.render('user/myapply', {
        title: 'My Apply',
        layout: 'layouts/user',
        applications
    })
}