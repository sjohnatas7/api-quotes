const { authSecret } = require('../../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcryptjs')


module.exports = app => {
    const signin = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({message:"Informe o email e a senha"})
        }

        const user = await app.db('users')
            .where({ email: req.body.email })
            .first()

        if (!user) return res.status(400).json({message:'Email inválido'})

        const isMatch = bcrypt.compareSync(req.body.password, user.password)
        if (!isMatch) return res.status(400).json({message:'Senha inválida'})

        const now = Math.floor(Date.now() / 1000)

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            iat: now,
            eat: now + (60 * 60 * 24 * 3)
        }

        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })
    }
    return signin 
}