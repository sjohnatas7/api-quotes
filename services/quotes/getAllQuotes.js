module.exports = app => {
    const get = async (req, res) => {
        const quotes = await app.db('quotes')
            .select('quotes.id', 'quotes.user_id', 'quotes.quote', 'quotes.updated_at')
            .leftJoin('users', 'quotes.user_id', 'users.id')
            .select('users.name as author')
            .orderBy('quotes.updated_at', 'desc')
            .catch(err => res.status(500).json({ message: 'Não foi possível conectar com o banco de dados', error: err }))
        res.json(quotes)
    }
    return get
}