const Joi = require('joi')
const jwt = require('jsonwebtoken')
const USER_SERVICE = require('../interService/userService')
const userService =  USER_SERVICE

//token Auth
const tokenAuth = async (req, res, next) => {
    try {
      let  verify = await userService.verifyToken(req, res)
        console.log(verify.data, "token is verified");
        next()
    }
    catch (error) {
        return res.status(401).send({ status: 401, message: '!Authentication failed', data: error.message })
        
    }
}

// const orderValidation = Joi.object({
//     customerID: Joi.number().required().error(new Error('please enter valid customerID')),
//     productID: Joi.number().required().error(new Error('please enter valid productID')),
//     // shippingAddress: Joi.string().error(new Error('please enter valid shippingAddress')),
//     // address:Joi.string().required().error(new Error('please enter valid address')),
//     // city: Joi.string().required().error(new Error('please enter valid city')),
//     // country: Joi.string().required().min(3).error(new Error('please enter valid country ')),
//     // postalCode:Joi.number().required().error(new Error('please enter valid totalAmount')),
//     totalAmount: Joi.number().required().error(new Error('please enter valid totalAmount')),
//     couponID: Joi.number().required().error(new Error('please enter valid couponID')),
//     created: Joi.string().required().error(new Error('please enter valid qty '))

// })

// const orderValid = async (req, res, next) => {
//     try {
//         await orderValidation.validateAsync({ ...req.body });
//         next()
//     } catch (err) {
//         if (err)
//            return err.status = await res.status(400).json({ status: 400, message: err.message || err })
//         next(err)

//     }
// }

//ADMIN

// const admin = (req, res, next) => {
//     try {
//         let check = req.user.userType
//         if (check === 2) {
//             next()
//         } else {
//             res.status(403).json({
//                 status: 403,
//                 message: 'forbidden'
//             })
//         }
//     }
//     catch (error) {
//         res.json({
//             message: error
//         })
//     }

// }




module.exports = {
    tokenAuth
}