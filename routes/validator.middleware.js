const { signupSchema, loginSchema, addEditProductSchema, editProfile } = require("../validation_schemas/schemas")

exports.signUpValidateMiddleware = (req, res, next) => {
    validateRequest(req, next, signupSchema);
}

exports.loginValidateMiddleware = (req, res, next) => {
    validateRequest(req, next, loginSchema);
}

exports.productValidateSchema = (req, res, next) => {
    validateRequest(req, next, addEditProductSchema);
}

exports.editProfileValidate = (req, res, next) => {
    validateRequest(req, next, editProfile);
}


const validateRequest = (req, next, schema) => {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
    };

    const { error, value } = schema.validate(req.body, options);

    if (error) {
        req.error = error.toString().split(': ')[1];
        next();
    } else {
        req.body = value;
        next();
    }
}