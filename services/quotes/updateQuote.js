const { quoteSchema } = require('../../core/Joi')
const { checksTheUser } = require('../../core/validation');

// Update quote route
module.exports = (app) => {

  const updateQuote = async (req, res) => {
    const { error } = quoteSchema.validate({ id: req.params.id });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    let quote = await app.db('quotes')
      .where({ id: req.params.id })
      .first();

    if (!quote) {
      return res.status(404).json({ message: 'Citação não encontrada' });
    }
    if (!checksTheUser(req.user, quote.user_id)) {
      return res.status(401).json({ message: 'Você não pode fazer isso' });
    }

    quote.quote = req.body.quote;
    quote.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

    try {
      await app.db('quotes')
        .update(quote)
        .where({ id: req.params.id });
      return res.status(202).json({ message: 'Citação editada com sucesso' });
    } catch (err) {
      return res.status(500).json({ message: 'Não foi possível conectar com o banco de dados', error: err });
    }
  };

  return updateQuote;
};
