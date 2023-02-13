const { quoteSchema } = require('../../core/Joi')
const { checksTheUser } = require('../../core/validation')

module.exports = app => {
    const getById = async (req, res) => {
        const { error } = quoteSchema.validate({ id: req.params.id })

        if (error) {
            console.log(error.message)
            return res.status(400).json({ message: error.message })
        }
        const quote = await app.db('quotes')
            .select('quote', 'id', 'user_id')
            .where({ id: req.params.id })
            .first()
            .catch(err => res.status(500).json({ message: 'Opss... Não foi possivel conectar com o banco de dados', error: err }))

        if (quote && !checksTheUser(req.user, quote.user_id)) {
            return res.status(401).json({ message: 'Você não tem autorização para fazer isso' })
        }
        if (quote) {
            res.json(quote)
        } else {
            res.status(400).json({ message: "Não foi possível encontrar essa citação" })
        }
    }
    return getById
}