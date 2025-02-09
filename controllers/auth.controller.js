import User from "../models/User.js"
import jwt from 'jsonwebtoken'

export const registerForm = (req, res) => {
    const error = req.query.error
    res.render('auth/register', { title: 'Register', layout: 'layouts/auth', error })
}

export const register = async (req, res) => {
    const { fullName, email, password, phone } = req.body
    if (!email || !fullName || !password || !phone) {
        res.redirect('/auth/register?error=Please provide all fields')
    }

    const isEmailExist = await User.findOne({ email })
    if (isEmailExist) res.redirect('/auth/register?error=Email allready exist')

    await User.create({ fullName, email, password, phone, role: 'user' })
    res.redirect('/auth/login?success=Registered success, please Login')
}

export const loginForm = (req, res) => {
    const { error, success } = req.query
    res.render('auth/login', { title: 'Login', layout: 'layouts/auth', error, success })
}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.redirect('/auth/login?error=Please provide all fields')
        }
        const user = await User.findOne({ email })
        if (!user || password !== user.password) {
            return res.redirect('/auth/login?error=email not found or password is not match')
        }

        const token = jwt.sign({ _id: user._id, name: user.fullName, role: user.role },
            process.env.JWT_SECRET, { expiresIn: '3d' })
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false
        })

        switch (user.role) {
            case 'admin':
                return res.redirect(`/admin/dashboard`)
            case 'user':
                return res.redirect(`/`)
        }
    } catch (err) {
        console.log(err.stack)
        res.redirect('/auth/login?error=Something went wrong')
    }
}

export const logout = (req, res) => {
    res.clearCookie('jwt')
    res.redirect('/auth/login?success=Logout Berhasil')
}

export const updateProfileForm = async (req, res) => {
    const id = req.user._id
    const user = await User.findById(id)
    const { success, error } = req.query
    res.render('auth/edit-profile', {
        title: 'Edit Profile',
        layout: 'layouts/auth',
        error, success, user
    })
}

export const updateProfile = async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body
        const id = req.user._id
        await User.findByIdAndUpdate(id, { fullName, email, password, phone })
        res.redirect('/auth/edit-profile?success=Berhasil update profile')
    } catch (err) {
        console.log(err.stack)
        res.redirect('/auth?edit-profile?error=Terjadi kesalahan')
    }
}