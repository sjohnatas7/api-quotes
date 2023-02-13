const { checksTheUser } = require('../../core/validation')
module.exports = app => {
    const remove = async (req, res) => {
        try {
            if (!checksTheUser(req.user, +req.params.id)) {
                return res.status(401).json({ message: 'Você não tem autorização para fazer isso' })
            }
            await app.db('quotes')
                .where({ user_id: req.params.id })
                .del()
            const count = await app.db('users')
                .update({ 'deleted_at': new Date() })
                .where({ id: req.params.id })

            if (count) {
                res.status(200).json({ deleted: count })
            } else {
                res.status(404).json({ message: "Usuário não encontrado" })
            }
        } catch (msg) {
            return res.status(500).json({message: "Não foi possível conectar com o banco de dados", error: msg})
        }
    }
    return remove
}