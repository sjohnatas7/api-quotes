const bcrypt = require('bcryptjs')
const { userSchema } = require('../../core/Joi')
const { existsOrError, notExistsOrError } = require('../../core/validation')

module.exports = app => {

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const createUser = async (req, res) => {
        const user = {
            password: req.body.password,
            email: req.body.email,
            name: req.body.name,
            repeat_password: req.body.confirmPassword,
            admin: req.body.admin
        }
        if (req.params.id) user.id = req.params.id
        
        if (!req.originalUrl.startsWith('/users')) user.admin = false
        if (!req.user || !req.user.admin) user.admin = false
        
        console.log(user.admin)
        try {
            await userSchema.validateAsync(user)
            existsOrError(user.name, 'O campo nome é necessário')
            existsOrError(user.email, 'O campo email é necessário')
            existsOrError(user.password, 'O campo senha é necessário')
            existsOrError(user.repeat_password, 'O campo de confirmação de senha é necessário')
            const userFromDb = await app.db('users').where({ email: user.email }).first()
            notExistsOrError(userFromDb, 'Usuario já cadastrado')
        } catch (error) {
            return res.status(400).json({message: error.message || error})
        }
        user.password = encryptPassword(req.body.password)
        delete user['repeat_password'] //not saving confirmPassword in the database

        app.db('users')
            .insert(user)
            .then(() => res.status(201).json())
            .catch(err => res.status(500).json({message: "Não foi possível conectar com o banco de dados", error: err}))
    }
    return createUser
}