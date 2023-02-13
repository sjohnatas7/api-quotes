const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .messages({
            "string.base": `"Nome" tem que ser do tipo 'texto'`,
            "string.empty": `"Nome" não pode ser um campo vazio`,
            "string.min": `"Nome" deve ter no mínimo 3 letras`,
            "string.max": `"Nome" deve ter no maxímo 30 letras`,
        }),

    password: Joi.string()
        .min(8)
        .max(30)
        .messages({
            "string.base": `"Senha" tem que ser do tipo 'texto'`,
            "string.empty": `"Senha" não pode ser um campo vazio`,
            "string.min": `"Senha" deve ter no mínimo 8 letras`,
            "string.max": `"Senha" deve ter no máximo 30 letras`,
        }),

    repeat_password: Joi.any().valid(Joi.ref('password')).messages({
        "any.only": "As senhas devem ser as mesmas",
    }),



    admin: Joi.boolean()
        .messages({
            "boolean.base": "Admin devem ser a boolean",
        }),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .messages({
            "string.base": `"Email" tem que ser do tipo 'texto'`,
            "string.email": `"Email" deve ser válido`,
            "any.required": `"Email" é um campo necessario`
        }),
    id: Joi.number()
        .messages({

        })
})
    .messages({
        'object.with': "As senhas e confirmação são campos necessários"
    })
const quoteSchema = Joi.object({
    id: Joi.number()
        .messages({
            'number.base': 'O campo id deve ser válido'
        }),
    quote: Joi.string()
        .messages({
            "string.base": "A citação deve ser um texto"
        }),
    user_id: Joi.number()
        .messages({
            'number.base': 'O campo id do autor deve ser válido'
        }),
})

module.exports = { userSchema, quoteSchema }