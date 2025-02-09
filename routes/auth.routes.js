import { Router } from "express"
import {
    registerForm,
    register,
    loginForm,
    Login,
    logout,
    updateProfile,
    updateProfileForm
} from '../controllers/auth.controller.js'
import { verifyToken } from "../middlewares/auth.middleware.js"
const router = Router()

router.get('/register', registerForm)
router.post('/register', register)
router.get('/login', loginForm)
router.post('/login', Login)
router.get('/logout', verifyToken, logout)
router.get('/edit-profile', verifyToken, updateProfileForm)
router.post('/edit-profile', verifyToken, updateProfile)

export default router