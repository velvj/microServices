const express = require('express')
const router = express.Router();
const userData = require('../controller/userController')
const validate = require('../validation/valid')


router.get('/getUser',userData.getUser)
router.post('/postUser',userData.postUser)
router.post('/signUp', userData.createUser)
router.put('/update/:id', validate.update, userData.updateUser)
router.get('/getId/:id',  userData.getUserId)
router.get('/getIdPk/:id', userData.getByPk)
router.delete('/delete/:id', userData.deleteUser)
router.delete('/deleteAll', userData.deleteAllUser)
router.post('/userLogin', validate.login, userData.userLogin)
router.post('/userMail', userData.userMail)
router.put('/resetPassword/:id', userData.resetPassword)
router.put('/VerifyEmail', userData.VerifyEmail)
router.get('/verify-tokenEmail/:token', userData.clickMail)
router.get('/tokenAuth', userData.tokenAuth)


module.exports = router