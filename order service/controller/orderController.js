const orderDb = require('../models');
const orderDatas = orderDb.orders
const { Op, DATEONLY } = require("sequelize");
const { date } = require('joi');
const productDB = require('../models');
const productsData = productDB.Products;
const pdf = require('pdf-creator-node')
var fs = require("fs");
var html = fs.readFileSync("model.html", "utf8");
const nodemailer = require('nodemailer');
const PRODUCT_SERVICE = require('../interService/productService')
const COUPON_SERVICE = require('../interService/couponService')
const USER_SERVICE = require('../interService/userService')
// const { getPaginatedData } = require("../middleware/pagination")



const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};




const pdfMail = async (orderData, dataList) => {

  try {
    var options = {
      format: "A4",
      orientation: "portrait",
      border: "10mm",
      header: {
        height: "45mm",
        contents: '<div style="text-align: center;">Order Data</div>'
      },
      footer: {
        height: "28mm",
        contents: {
          first: 'Cover page',
          // 2: 'Second page', // Any page number is working. 1-based index
          default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
          last: 'Last Page'
        }
      }
    };
    var document = {
      html: html,
      data: {
        users: {
          ...orderData,
          pro: dataList
        }
      },
      path: "./output.pdf",
      // type: "",
    };
    pdf.create(document, options)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });
    let transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "login",
        user: process.env.EMAIL_ID,
        pass: process.env.PASSWORD
      }
    });
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: process.env.TO_ID,
      subject: 'hello your order detail',
      html: `<p>You requested for order detailes, kindly use this <a href=http://localhost:3000/user/PDF/hi >link</a> to find PDF DATA</p>`,
      attachments: {
        path: 'C:\\Node Task\\nodesql\\output.pdf'
      }
    };
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      return console.log("Message sent: %s", info.messageId, info)
    })
  } catch (err) {
    return console.log("Message sent: %s", err);

  }
}

//create Order

const createOrder = async (req, res) => {
  try {
    const productService = await PRODUCT_SERVICE.productData(req, res)
    var id = req.body.productID
    const dataList = await id.map((e) => {
      const getting = productService.data.find((obj) => {
        if (obj.productID !== e) {
          console.log(`ProductId ${e.repeate} not found`)
        }
        return obj.productID == e;
      })
      return getting;
    })
    const price = await dataList.reduce((pre, curr) => {
      pre = pre + curr.price
      return pre
    }, 0)
    const orderlist = {

      customerID: req.body.customerID,
      productID: req.body.productID,
      shippingAddress: {
        address: req.body.shippingAddress.address,
        city: req.body.shippingAddress.city,
        postalCode: req.body.shippingAddress.postalCode,
        country: req.body.shippingAddress.country
      },
      totalAmount: price,
      created: new Date(),
      couponID: req.body.couponID
    }
    let orderData = await orderDatas.create(orderlist);
    pdfMail(orderData, dataList)
    return res.status(200).send({ status: 200, message: "order created successfully", data: orderData })
  } catch (err) {
    return res.status(400).json({ status: 400, message: err.message || err });
  }
}




//get order discount and amount

const getOrderID = async (req, res) => {
  try {
    const productService = await PRODUCT_SERVICE.productData(req, res)
    const userService = await USER_SERVICE.userData(req, res)
    const couponService = await COUPON_SERVICE.couponData(req, res)
    var totalData = [...productService.data, ...couponService.data, ...userService.data]

    const Id = req.params.id
    let getproduct = await orderDatas.findOne({ where: { id: Id } })
    if (!getproduct.couponID) {
      return res.status(200).send({ status: 200, message: "Discount Percentage Data", data: getproduct })
    } else {
      let getDatas = await orderDatas.findAll({ where: { id: Id }, raw: true })
      let getProduct = [...productService.data, ...userService.data, ...couponService.data]
      const allData = await getDatas.reduce((acc, curr) => {
        acc = [...acc, ...curr.productID]
        return acc
      }, [])

      const idData = await allData.map((e) => {
        const getting = productService.data.find((obj) => {
          return obj.productID == e;
        })
        return getting;
      })

      //coupon data
      let coupons = getDatas.map((ele) => {
        ele.couponID = getProduct.find((obj) => obj.couponID == ele.couponID)
        return ele;
      })
      // console.log(coupons[0].couponID.endDate,'coupons');
      let customer = getProduct.map((datas) => {
        datas.customerID = getProduct.find((obj) => obj.customerID == datas.customerID)
        return datas;
      })


      let products = getDatas.map((val) => {
        val.productID = val.productID.map((data) => {
          let productDetails = idData.find((obj) => obj.productID == data)
          return { ...productDetails };
        })
        return val;
      })
      const lastDate = new Date(coupons[0].couponID.endDate);
      const currentDate = new Date();
      if ((lastDate >= currentDate) && (coupons[0].couponID.couponStatus)) {
        if (coupons[0].couponID.type === "discount") {
          var getDiscount = await getDatas[0].totalAmount - (getDatas[0].totalAmount * coupons[0].couponID.value / 100);
          let final = { getproduct, finalAmount: getDiscount, discounted: getDatas[0].totalAmount - getDiscount }
          return res.status(200).send({ status: 200, message: "Discount Percentage Data", data: final })
        }
        else if (coupons[0].couponID.type === "amount") {
          let getamount = await getDatas[0].totalAmount - coupons[0].couponID.value;
          let final = { getproduct, finalAmount: getamount, discounted: getDatas[0].totalAmount - getamount }
          return res.status(200).send({ status: 200, message: "get order by id succesfully", data: final })
        }
      } else {
        return res.status(200).send({ status: 200, message: "Date is expired" })
      }
    }
  } catch (err) {
    res.status(400).send({ status: 400, message: err.message || err })
  }

}


//get All Data

const getOrders = async (req, res) => {
  try {
    const page = +req.query.page;
    const size = +req.query.size;
    let order_Data = await orderDatas.findAll({ offset: page * size, limit: size });
    let count = await orderDatas.count();

    //find productID
    let data = await order_Data.reduce((acc, curr) => {
      acc = [...acc, ...curr.productID]
      return acc
    }, [])
    console.log(data, 'data');
    data = await PRODUCT_SERVICE.productDataPage(req, res, data)
    console.log(data, 'services');

    //find coupondatasID
    let coupon = await order_Data.map((cid) => { return cid.couponID })
    coupon = await COUPON_SERVICE.couponDataPost(req, res, coupon)
    console.log(coupon, 'users');

    // var totalData =  [...productService.data,... couponService.data,...userService.data ]
    let pro_Data = await order_Data.reduce((acc, curr) => {
      acc = [...acc, ...curr.productID]
      return acc
    }, [])


    const idData = pro_Data.map((e) => {
      const getting = data.find((obj) => {
        return obj.productID == e;
      })
      return getting;
    })

    let products = await order_Data.map((val) => {
      val.productID = val.productID.map((datas) => {

        let productDetails = idData.find((obj) => obj.productID == datas)
        return { ...productDetails };
      })
      return val;
    })

    //coupon data
    let coupons = order_Data.map((ele) => {
      ele.couponID = coupon.find((obj) => obj.couponID == ele.couponID)
      return ele;
    })

    //find userid
    let users = await order_Data.map((uid) => { return uid.customerID })
    console.log(users, 'ids');
    users = await USER_SERVICE.userDataPost(req, res, users)
    console.log(users, 'users');

    let customer = order_Data.map((datas) => {
      datas.customerID = users.find((objs) => objs.customerID == datas.customerID)
      return datas;
    })

    return res.status(200).send({ status: 200, message: "order data details viewed successfully", data: { order_Data, "TotalCount": count } })
  } catch (err) {
    console.log(err)
    res.status(400).send({ status: 400, message: "cannot find order datas" })
  }
}

//get order id
const getOrderById = async (req, res) => {
  try {
    const Id = req.params.id
    let order_Data = await orderDatas.findAll({ where: { id: Id }, raw: true })

    const productService = await PRODUCT_SERVICE.productData(req, res)
    const userService = await USER_SERVICE.userData(req, res)
    const couponService = await COUPON_SERVICE.couponData(req, res)
    var totalData = [...productService.data, ...couponService.data, ...userService.data]
    const allData = await order_Data.reduce((acc, curr) => {
      acc = [...acc, ...curr.productID]
      return acc
    }, [])


    const idData = await allData.map((e) => {
      const getting = productService.data.find((obj) => {
        return obj.productID == e;
      })
      return getting;
    })

    //coupon data
    let coupons = order_Data.map((ele) => {
      ele.couponID = totalData.find((obj) => obj.couponID == ele.couponID)
      return ele;
    })

    let customer = order_Data.map((datas) => {
      datas.customerID = totalData.find((obj) => obj.customerID == datas.customerID)
      return datas;
    })


    let products = order_Data.map((val) => {
      val.productID = val.productID.map((data) => {
        let productDetails = idData.find((obj) => obj.productID == data)
        return { ...productDetails };
      })
      return val;
    })

    return res.status(200).send({ status: 200, message: "users details viewed successfully", data: order_Data })
  } catch (err) {
    console.log(err, 'err')
    res.status(400).send({ status: 400, message: "something went wrong" || err })
  }
}

//update Order
const updateOrder = async (req, res) => {
  try {
    const update = await orderDatas.update({
      customerID: req.body.customerID,
      productID: req.body.productID,
      shippingAddress: req.body.shippingAddress,
      totalAmount: req.body.totalAmount,
      created: req.body.created,
      couponID: req.body.couponID
    }, { where: { id: req.params.id } })
    if (update) {
      return res.status(200).send({ status: 200, message: "order details updated successfully", data: update })
    }
  } catch (err) {
    res.status(400).send({ status: 400, message: err })
  }
}

//deleteOrder
const deletetOrder = async (req, res) => {
  try {
    const delete_Order = await orderDatas.destroy({ where: { id: req.params.id } })
    console.log("successfully");
    if (!delete_Order) return await res.status(200).send({ status: 200, message: "no data there", data: delete_Order })
    else return await res.status(200).send({ status: 200, message: "order deleted successfully", data: delete_Order })
  } catch (err) {
    res.status(400).send({ status: 400, message: err })
  }
}
module.exports = { createOrder, getOrders, getOrderById, updateOrder, deletetOrder, getOrderID, pdfMail }