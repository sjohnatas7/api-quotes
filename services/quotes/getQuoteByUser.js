const { quoteSchema } = require('../../core/Joi')

module.exports = app => {
    const getByUser = async (req, res) => {
        const { error } = quoteSchema.validate({ user_id: req.params.id })
        if (error) {
            return res.status(400).json({ message: error.message })
        }
        const quotes = await app.db('quotes')
            .where({ user_id: req.params.id })
            .catch(err => res.status(500).json({ message: 'Opss... Não foi possivel conectar com o banco de dados', error: err }))

        if (quotes.length !== 0) {
            res.json(quotes)
        } else {
            res.status(400).json({ message: "Não foi possivel encontrar esse usuário" })
        }
    }
    return getByUser
}