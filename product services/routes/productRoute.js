const express = require('express');
const router =  express.Router();
const productRouter =require('../controller/productController');
const validation =require('../validation/valid')



router.post('/createProducts',validation.tokenAuth,validation.productValid,productRouter.createProducts)
router.put('/updateProducts/:id',productRouter.updateProducts)
router.get('/productsPk/:id',productRouter.getByPkProducts)
router.get('/produtsAll', validation.tokenAuth,productRouter.getProducts)
router.get('/productId/:id',productRouter.getProductById)
router.delete('/deleteAll',productRouter.deleteAllUser)
router.delete('/deleteID/:id',productRouter.deleteProduct)
router.post('/addfile',productRouter.addfile)
router.post('/postProducts', productRouter.postProducts)





module.exports = router ;