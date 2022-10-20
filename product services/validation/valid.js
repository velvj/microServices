const Joi = require('joi')
const jwt = require('jsonwebtoken')





//token Auth
const tokenAuth = async (req, res, next) => {
    try {
        // const token = req.headers.authorization.split(' ')[1]
        let token = await req.header("x-auth-token");
        if (!token) return res.status(403).json({ status: 403, message: "access denied no token provided" })
        let decode = jwt.verify(token, process.env.ACCESS_TOKEN);
        console.log(decode)
        req.user = decode
        next()
    }
    catch (error) {
        res.json({
            message: 'Authendication failed !'
        })
    }
}
const admin = (req, res, next) => {
    try {
        let check = req.user.userType
        if (check === 2) {
            next()
        } else {
            res.status(403).json({
                status: 403,
                message: 'forbidden'
            })
        }
    }
    catch (error) {
        res.json({
            message: error
        })
    }

}
//product validation

const productValidation = Joi.object({
    productName: Joi.string().required().min(3).error(new Error('please enter valid productName')),
    brand: Joi.string().required().min(3).error(new Error('please enter valid brand')),
    model: Joi.string().required().max(9999999999).error(new Error('please enter valid model name')),
    category: Joi.string().required().min(3).error(new Error('please enter valid category')),
    price: Joi.string().required().max(9999999999).error(new Error('please enter valid price ')),
    date: Joi.string().required().min(3),
    color: Joi.string().required().min(3),
    qty: Joi.string().required().error(new Error('please enter valid qty '))

})

const productValid = async (req, res, next) => {
    try {
        await productValidation.validateAsync({ ...req.body });
        next()
    } catch (err) {
        if (err)
            err.status = await res.status(400).json({ status: 400, message: err.message || err })
        next(err)

    }
}




module.exports = {
    tokenAuth, productValid, admin
}