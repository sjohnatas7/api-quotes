const { quoteSchema } = require('../../core/Joi')
const { existsOrError, checksTheUser } = require('../../core/validation')

module.exports = app => {

    const create = async (req, res) => {
        if (!checksTheUser(req.user, req.body.user_id)) {
            return res.status(401).json({ message: 'Você não tem autorização para fazer isso' })
        }
        let quote = {
            quote: req.body.quote,
            user_id: req.body.user_id || req.user.id,
        }

        try {
            await quoteSchema.validateAsync(quote)
            existsOrError(quote.quote, 'Citação não informada')
        } catch (error) {
            return res.status(400).json({message: error.message || error})
        }

        quote['created_at'] = quote['updated_at'] = new Date().toISOString().slice(0, 19).replace('T', ' ');
        return app.db('quotes')
            .insert(quote)
            .then(res.status(201).json({ message: 'Citação criada com sucesso' }))
            .catch(err => res.status(400).json({ message: 'Não foi possível criar citação com sucesso', error: err }))
    }
    return create
}