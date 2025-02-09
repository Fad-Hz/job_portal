import Apply from "../models/Apply.js"
import Jobs from "../models/Jobs.js"
import User from '../models/User.js'

export const allJobs = async (req, res) => {
    const jobs = await Jobs.find().populate('createdBy')
    const { error, success } = req.query
    if (!jobs) res.redirect('/admin/jobs?error=Not found Jobs')
    res.render('admin/job/data', {
        title: 'Jobs Data',
        error, success,
        layout: 'layouts/admin',
        jobs
    })
}

export const addJobForm = (req, res) => {
    const { error } = req.query
    res.render('admin/job/add', {
        title: 'Add Job',
        layout: 'layouts/admin',
        error
    })
}

export const addJob = async (req, res) => {
    try {
        const { company, position, location, requirement, workType, workLocation } = req.body
        const createdBy = req.user._id
        if (!company || !position || !location || !requirement) {
            return res.redirect('/admin/jobs/add?error=Please provide all fields')
        }
        await Jobs.create({ company, position, location, requirement, workType, workLocation, createdBy })
        return res.redirect('/admin/jobs?success=Success add some Job')
    } catch (err) {
        console.log(err.stack)
        res.redirect('/admin/jobs/add?error=Failed to add Job, try again')
    }
}

export const deleteJob = async (req, res) => {
    await Jobs.findByIdAndDelete(req.params.id)
    res.redirect('/admin/jobs?success=Success delete Job')
}

export const editJobForm = async (req, res) => {
    const job = await Jobs.findById(req.params.id)
    const { error } = req.query
    res.render('admin/job/edit', {
        title: 'Edit Job',
        job, error,
        layout: 'layouts/admin'
    })
}

export const editJob = async (req, res) => {
    try {
        const id = req.params.id
        const { company, position, location, requirement, workType, workLocation } = req.body
        await Jobs.findByIdAndUpdate(id, { company, position, location, requirement, workType, workLocation })
        res.redirect('/admin/jobs?success=Success edit this Job')
    } catch (err) {
        console.log(err.message)
        res.redirect('/admin/jobs/edit/:id?error=Failed to add Job, try again')
    }
}

export const allApliedsJob = async (req, res) => {
    const applications = await Apply.find().populate('user').populate({ path: 'job', createdBy: req.user.id })
    const { error } = req.query
    if (!applications.length) res.redirect('/admin/jobs/applied?error=There are no jobs to apply for here')
    res.render('admin/job/applied', {
        title: 'All Aplied Jobs',
        error,
        layout: 'layouts/admin',
        applications: applications.filter(app => app.job)
    })
}

export const apliedJobDetail = async (req, res) => {
    try {
        const id = req.params.id
        const aplication = await Apply.findById(id).populate('user').populate('job')
        const { error, success } = req.query
        res.render('admin/job/applied_detail', {
            title: 'Applied detail',
            layout: 'layouts/admin',
            error, success, aplication
        })
    } catch (err) {
        console.log(err.stack)
        return res.redirect(`/admin/jobs/applied/${id}?error=Something went wrong`)
    }
}


export const changeStatus = async (req, res) => {
    const id = req.params.id
    await Apply.findByIdAndUpdate(id, { status: req.body.status })
    return res.redirect(`/admin/jobs/applied/${id}?success=Successfuly change aplication jobs status`)
}

export const dashboard = async (req, res) => {
    const title = 'Admin Dashboard'
    const user = req.user.name
    res.render('admin/dashboard', { title, user, layout: 'layouts/admin' })
}

export const users = async (req, res) => {
    const allUsers = await User.find()
    const usersWithApplications = await Promise.all(allUsers.map(async user => {
        const applications = await Apply.find({ user: user._id }).populate("job")

        return {
            ...user.toObject(),
            totalApplied: applications.length,
            accepted: applications.filter(app => app.status === "accepted").length,
            rejected: applications.filter(app => app.status === "rejected").length,
            applications
        }
    }))

    res.render("admin/users", {
        users: usersWithApplications,
        title: 'Users Data',
        layout: 'layouts/admin'
    })
}