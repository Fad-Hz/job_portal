import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt 
    if (!token) res.redirect('/auth/login?error=Token tidak ada')
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) res.redirect('/auth/login?error=Token tidak valid atau kadaluarsa')
        req.user = decoded 
        next()
    })
}

export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') res.send('forbidden, access denied!')
    next()
}