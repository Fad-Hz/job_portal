export default function errorMiddleware (err, req, res, next) {
    console.log(err.stack)
    res.status(500).send('internal server error')
    next()
}