const Joi = require('joi');

exports.signupSchema = Joi.object({

    email: Joi.string().email().required().messages({
        'string.required': `Email field is required`,
        'string.email': `Please enter a valid email address`,
    }).lowercase(),

    username: Joi.string(),

    firstname: Joi.string(),

    lastname: Joi.string(),

    password: Joi.string().required().min(6).alphanum().messages({
        'string.empty': `Password field cannot be empty`,
        'string.min': `Password should be at least be 6 characters in length`,
        'any.required': `Password field is required!`
    }),

    cpassword: Joi.string().valid(Joi.ref('password')).required().error(new Error('Passwords does not match'))
})

exports.loginSchema = Joi.object({

    email: Joi.string().email().required().messages({
        "string.required": 'Email field is required',
        "string.email": 'Please enter a valid email address',
    }).lowercase(),

    password: Joi.string().required().messages({
        "string.required": 'Password field is required',
    })

})


exports.addEditProductSchema = Joi.object({

    pname: Joi.string().min(3).required().messages({
        'string.empty': `Product Name cannot be empty!`,
        'string.min': `Product name should be atleast 6 characters long`
    }),

    price: Joi.number().precision(2).required().messages({
        'number.empty': `Product Price cannot be empty!`,
        'number.precision': `Product price should only have precision of 2 decimal points`
    }),

    purl: Joi.string().uri().messages({
        'string.uri': `Not a valid image url`
    }),

    pdescription: Joi.string().min(2).default('N/A').required(),

    productid: Joi.any()

})


exports.editProfile = Joi.object({
    username: Joi.string(),

    firstname: Joi.string(),

    lastname: Joi.string(),

    email: Joi.string().email().required().messages({
        'string.required': `Email field is required`,
        'string.email': `Please enter a valid email address`,
    }).lowercase(),

    address: Joi.string()

})