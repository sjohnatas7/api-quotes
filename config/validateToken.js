
module.exports = function validateToken() {
    return (req, res, next) => {
        const userData = req.user || null
        try {
            if (userData) {
                const now = Math.floor(Date.now() / 1000)
                if (userData.eat > now) {
                    return next()
                }
            }
        } catch (e) {
            console.log(e)
        }
        res.status(401).json({message:'O token está expirado'})
    }
}