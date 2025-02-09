import { Router } from 'express'
const router = Router()
import {
    homePage,
    allJobs,
    detailJob,
    applyJobForm,
    applyJob,
    myApply
} from '../controllers/user.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

router.get('/', verifyToken, homePage)
router.get('/jobs', verifyToken, allJobs)
router.get('/jobs/detail/:id', verifyToken, detailJob)
router.get('/jobs/apply/:id', verifyToken, applyJobForm)
router.post('/jobs/apply/:id', verifyToken, applyJob)
router.get('/myapply', verifyToken, myApply)

export default router