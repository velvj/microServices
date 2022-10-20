const express = require('express');
const router = express.Router();
const couponData = require('../controller/couponController');
const validation =require('../validation/valid')


//coupon data

router.post('/createCoupon', validation.tokenAuth, validation.couponsValid,couponData.createCoupon)
router.get('/getCoupon/:id', validation.tokenAuth, couponData.getCoupons)
router.get('/getAllCoupon', couponData.getAllCoupons)
router.post('/postAllCoupon', couponData.postAllCoupons)
router.put('/updateCoupons/:id', couponData.updateCoupon)
router.delete('/deletetCoupons/:id', couponData.deletetCoupon)


module.exports = router;