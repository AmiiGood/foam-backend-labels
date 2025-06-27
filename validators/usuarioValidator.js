const Joi = require('joi');

const usuarioSchema = Joi.object({
    nombre: Joi.string()
        .required()
        .min(2)
        .max(100)
        .trim()
        .messages({
            'string.min': 'El nombre debe tener al menos 2 caracteres',
            'string.max': 'El nombre no puede exceder 100 caracteres'
        }),
    correo: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'edu', 'gov', 'mx'] } })
        .trim()
        .messages({
            'string.email': 'El correo electrónico no es válido'
        }),
    contrasena: Joi.string()
        .required()
        .min(8)
        .max(100)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
        .messages({
            'string.min': 'La contraseña debe tener al menos 8 caracteres',
            'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
        }),
    rol_id: Joi.number()
        .integer()
        .required()
        .min(1)
        .messages({
            'number.min': 'El ID de rol debe ser mayor a 0'
        })
});

const updateUsuarioSchema = Joi.object({
    nombre: Joi.string()
        .min(2)
        .max(100)
        .trim()
        .messages({
            'string.min': 'El nombre debe tener al menos 2 caracteres',
            'string.max': 'El nombre no puede exceder 100 caracteres'
        }),
    correo: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'edu', 'gov', 'mx'] } })
        .trim()
        .messages({
            'string.email': 'El correo electrónico no es válido'
        }),
    contrasena: Joi.string()
        .min(8)
        .max(100)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
        .messages({
            'string.min': 'La contraseña debe tener al menos 8 caracteres',
            'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
        }),
    rol_id: Joi.number()
        .integer()
        .min(1)
        .messages({
            'number.min': 'El ID de rol debe ser mayor a 0'
        })
});

module.exports = {
    usuarioSchema,
    updateUsuarioSchema
};
