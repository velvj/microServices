const Joi = require('joi')
const jwt = require('jsonwebtoken')
const userdatas = require('../models')

const Validate = Joi.object({
    name: Joi.string().required().min(3).error(new Error('Please enter a valid name ')),
    phone: Joi.string().required().min(10).max(10).error(new Error('Please enter a valid phone number')),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).lowercase().required().error(new Error('Please enter a valid Email ID')),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().error(new Error('Please enter a valid password'))
    // isVerified:Joi.boolean().required().error(new Error('Please enter Boolean data'))

})


const signUp = async (req, res, next) => {
    try {

        await Validate.validateAsync({ ...req.body });
        next()
    } catch (err) {
        if (err)
            err.status = res.status(400).json({ status: 400, message: err.message || err })
        next(err)

    }
}

const validater = Joi.object({
    username: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).lowercase().required().error(new Error('Please enter a valid Email ID')),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,10}$')).required().error(new Error('Please enter a valid password'))
})

const login = async (req, res, next) => {
    try {
        await validater.validateAsync({ ...req.body })
        next()
    } catch (err) {
        if (err)
            err.status = await res.status(400).json({ status: 400, message: err.message || err })
        next(err)
    }
}

//update validation

const updateValidate = Joi.object({
    name: Joi.string().required().min(3).error(new Error('Please enter a valid name ')),
    phone: Joi.string().required().min(10).max(10).error(new Error('Please enter a valid phone number')),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).lowercase().required().error(new Error('Please enter a valid Email ID')),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().error(new Error('Please enter a valid password')),
    isVerified:Joi.boolean().required().error(new Error('Please enter Boolean data'))
})


const update = async (req, res, next) => {
    try {

        await updateValidate.validateAsync({ ...req.body });
        next()
    } catch (err) {
        if (err)
            err.status = res.status(400).json({ status: 400, message: err.message || err })
        next(err)

    }
}



//token Auth

// const tokenAuth = async (req, res, next) => {
//     try {
//         const token = await req.header("x-auth-token");
//         if (!token) return res.status(403).json({ status: 403, message: "access denied no token provided" })
//         const decoded =  jwt.verify(token, process.env.ACCESS_TOKEN);
//         req.man = await userdatas.user.findByPk(decoded.ID);
//         console.log(req.man,"reqman");
//         next();
//     } catch (err) {
//         if (err)
//             err.status = res.status(403).json({ status: 403, message: err.message || err })
//         next(err)

//     }

// }
module.exports = {
    signUp, login, update
}