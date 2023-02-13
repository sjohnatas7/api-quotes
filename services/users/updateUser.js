module.exports = app => {
    const update = async (req, res) => {
        if (!req.user.admin && req.user.id != req.params.id) {
            return res.status(401).json({ message: "Você não tem autorização para editar esse usuario" })
        }
        const user = {}
        if (req.body.password) {
            user.password = encryptPassword(req.body.password)
        }
        if (req.body.name) {
            user.name = req.body.name
        }
        if (req.body.email) {
            user.email = req.body.email
        }
        if (!req.originalUrl.startsWith('/admin/users') ||
            !req.user ||
            !req.user.admin) {
            user.admin = false
        } else {
            if (req.body.admin) user.admin = req.body.admin
        }

        const count = await app.db('users')
            .update(user)
            .where({ id: req.params.id })
            .whereNull('deleted_at')

        count 
            ? res.status(200).json({ updated: count })
            : res.status(404).json({ message: "Usuário não encontrado" })
        
    }
    return update
}