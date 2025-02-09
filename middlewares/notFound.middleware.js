export default function notFoundMiddleware(err, req, res, next) {
    res.status(404).send('this page is not found')
    next()
}