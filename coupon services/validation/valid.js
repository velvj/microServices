const Joi = require('joi')
const jwt = require('jsonwebtoken')

const couponsValidation = Joi.object({
    offerName: Joi.string().required().min(3).error(new Error('please enter valid offerName')),
    couponCode: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,14}$')).required().error(new Error('Please enter a valid couponCode')),
    startDate: Joi.date().required().error(new Error('please enter valid startDate')),
    endDate: Joi.date().required().error(new Error('please enter valid endDate')),
    type: Joi.string().required().valid("discount", "amount").error(new Error('INVALID TYPE')),
    value: Joi.number().required().error(new Error('please enter valid value')),
    couponStatus: Joi.boolean()
})


const couponsValid = async (req, res, next) => {
    try {
        await couponsValidation.validateAsync({ ...req.body });
        next()
    } catch (err) {
        if (err)
            err.status = await res.status(400).send({ status: 400, message: err.message || err })
        next(err)

    }
}

//token Auth
const tokenAuth = async (req, res, next) => {
    try {
        // const token = req.headers.authorization.split(' ')[1]
        let token = await req.header("x-auth-token");
        if (!token) return res.status(403).json({ status: 403, message: "access denied no token provided" })
        let decode = jwt.verify(token, process.env.ACCESS_TOKEN);
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






module.exports = {
    tokenAuth, couponsValid, admin
}