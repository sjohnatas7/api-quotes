const { quoteSchema } = require('../../core/Joi')
const { existsOrError, checksTheUser } = require('../../core/validation')

module.exports = app => {
    const remove = async (req, res) => {
        try {
            quoteSchema.validateAsync({ id: req.params.id })
            if (!checksTheUser(req.user, req.body.user_id)) {
                return res.status(401).json({ message: 'Você não tem autorização para fazer isso' })
            }
            existsOrError(req.params.id, 'Código da citação não informado')
            const quotesExists = await app.db('quotes')
                .where({ id: req.params.id })
                .first()
            existsOrError(quotesExists, 'Citação não encontrada')
            const rowsDeleted = await app.db('quotes')
                .where({ id: req.params.id, user_id: req.body.user_id || req.user.id }).del()
            rowsDeleted === 0
                ? res.status(400).json({ message: 'Citação não encontrada' })
                : res.status(204).send()
        } catch (msg) {
            return res.status(400).json({message: msg})
        }

    }
    return remove
}