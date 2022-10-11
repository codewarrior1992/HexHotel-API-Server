const Joi = require('@hapi/joi');

const registerValidation = (data) =>{
    const schema = Joi.object({
        email : Joi.string().min(6).max(40).email().required(),
        password : Joi.string().min(6).max(20).required()
    })
    return Joi.validate(data,schema)
}

const loginValidation = (data) =>{
    const schema = Joi.object({
        email : Joi.string().min(6).max(40).email().required(),
        password : Joi.string().min(6).max(20).required(),
    })
    return Joi.validate(data, schema)
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
