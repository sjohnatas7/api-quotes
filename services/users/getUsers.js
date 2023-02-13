


module.exports = app => {
    const get = async (req, res) => {
        const users = await app.db('users')
            .select('id', 'name', 'email', 'admin')
            .whereNull('deleted_at')
            .catch(err => res.status(500).json({message: "Não foi possível conectar com o banco de dados", error: err}))
        res.status(200).json(users)
    }
    return get
}