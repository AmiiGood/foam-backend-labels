const Joi = require('joi');

// Schema para crear un artículo
const createArticuloSchema = Joi.object({
    SKU: Joi.string().max(50).allow(null, '')
        .messages({
            'string.max': 'El SKU no puede exceder 50 caracteres'
        }),
    Descripcion: Joi.string().allow(null, '')
        .messages({
            'string.base': 'La descripción debe ser texto'
        }),
    UnitCode: Joi.string().max(20).allow(null, '')
        .messages({
            'string.max': 'El código de unidad no puede exceder 20 caracteres'
        }),
    GroupCode: Joi.string().max(50).allow(null, '')
        .messages({
            'string.max': 'El código de grupo no puede exceder 50 caracteres'
        }),
    FamilyCode: Joi.string().max(50).allow(null, '')
        .messages({
            'string.max': 'El código de familia no puede exceder 50 caracteres'
        }),
    KindCode: Joi.string().max(50).allow(null, '')
        .messages({
            'string.max': 'El código de tipo no puede exceder 50 caracteres'
        }),
    ColorCode: Joi.string().max(50).allow(null, '')
        .messages({
            'string.max': 'El código de color no puede exceder 50 caracteres'
        }),
    Size: Joi.string().max(20).allow(null, '')
        .messages({
            'string.max': 'La talla no puede exceder 20 caracteres'
        }),
    UPCCode: Joi.string().max(50).allow(null, '')
        .messages({
            'string.max': 'El código UPC no puede exceder 50 caracteres'
        }),
    QuantityPerLU: Joi.string().max(20).allow(null, '')
        .messages({
            'string.max': 'La cantidad por LU no puede exceder 20 caracteres'
        })
});

// Schema para actualizar un artículo
const updateArticuloSchema = Joi.object({
    SKU: Joi.string().max(50).allow(null, ''),
    Descripcion: Joi.string().allow(null, ''),
    UnitCode: Joi.string().max(20).allow(null, ''),
    GroupCode: Joi.string().max(50).allow(null, ''),
    FamilyCode: Joi.string().max(50).allow(null, ''),
    KindCode: Joi.string().max(50).allow(null, ''),
    ColorCode: Joi.string().max(50).allow(null, ''),
    Size: Joi.string().max(20).allow(null, ''),
    UPCCode: Joi.string().max(50).allow(null, ''),
    QuantityPerLU: Joi.string().max(20).allow(null, '')
}).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar'
});

// Schema para parámetros de búsqueda
const searchParamsSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().allow(''),
    sortBy: Joi.string().valid('ID', 'SKU', 'Descripcion', 'GroupCode', 'FamilyCode').default('ID'),
    sortOrder: Joi.string().valid('ASC', 'DESC').default('ASC')
});

module.exports = {
    createArticuloSchema,
    updateArticuloSchema,
    searchParamsSchema
};
