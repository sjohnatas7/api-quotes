const { userSchema, quoteSchema } = require("../core/Joi")

describe('testing joi library', () => {
    it('creates a perfect user', async () => {
        const { error } = userSchema.validate({
            name: 'TestUser',
            email: 'testuser@example.com',
            password: 'password',
            'repeat_password': 'password',
            admin: false

        })
        expect(error).toBeFalsy()
    })
    it('creates a not validate email user', async () => {
        const { error } = userSchema.validate({
            name: 'TestUser',
            email: 'testuser@example',
            password: 'password',
            'repeat_password': 'password',
            admin: false

        })
        expect(error.message).toBe('"Email" deve ser válido')
    })
    it('creates a not matching password and repeat_password', async () => {
        const { error } = userSchema.validate({
            name: 'TestUser',
            email: 'testuser@example.com',
            password: 'password',
            repeat_password: 'pass',
            admin: false
        })
        expect(error.message).toBe('As senhas devem ser as mesmas')
    })
    it('creates a boolean admin', async () => {
        const { error } = userSchema.validate({
            name: 'TestUser',
            email: 'testuser@example.com',
            password: 'password',
            repeat_password: 'password',
            admin: 'falsy'
        })
        expect(error.message).toBe('Admin devem ser a boolean')
    })
    it('test a the password to be less than 8 lettters', async () => {
        const { error } = userSchema.validate({
            password: 'pass',
        })
        expect(error.message).toBe("\"Senha\" deve ter no mínimo 8 letras")
    })
    it('test a the password to be more than 30 lettters', async () => {
        const { error } = userSchema.validate({
            password: 'passpasspasspasspasspasspasspasspasspaspsap',
        })
        expect(error.message).toBe("\"Senha\" deve ter no máximo 30 letras")
    })
    it('test a the id', async () => {
        const { error } = quoteSchema.validate({
            id: 'TestId',
        })
        expect(error.message).toBe('O campo id deve ser válido')
    })
})