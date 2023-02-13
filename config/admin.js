module.exports = middleaware => {
    console.log('middle')
    return (req, res, next) => {
        if (req.user.admin) {
            middleaware(req,res,next)
        } else {
            res.status(401).json({message:'Autorização inválida'})
        }
    }
}