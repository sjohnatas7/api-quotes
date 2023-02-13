const { existsOrError } = require('../../core/validation')


module.exports = app => {
    const getById = async (req, res) => {
        try {
            const user = await app.db('users')
                .select('id', 'name', 'email')
                .where({ 'id': req.params.id })
                .whereNull('deleted_at')
                .first()
            existsOrError(user, 'Usuário não encontrado')
            const quotesCount = await app.db('quotes')
                .count('id as count')
                .where({ 'user_id': req.params.id })
                .catch(err => res.status(500).json({ message: "Não foi possível conectar com o banco de dados", error: err }))
            user.quotesCount = quotesCount[0].count
            res.json(user)
        } catch (err) {
            return res.status(500).json({message: "Não foi possível conectar com o banco de dados", error: err})
        }
    }
    return getById
}