const { newAxios, newAxiosWithoutAuth, internelApi } = require('.');
const COUPON_SERVICE = process.env.COUPON_SERVICE_BASE_URL;



class CouponService {
    couponData = async (req, res) => {
        try {
            let result = await newAxios(req, res, {
                baseURL: COUPON_SERVICE,
                url: `/coupon/getAllCoupon`,
                method: "GET"
            })
            return result.data || [];
        } catch (error) {
            console.log("something went wrong", error.message);
            return Promise.reject({ error: true, status: 422, message: error })
        }
    }
    couponDataPost = async (req, res, coupon) => {
        try {
            let result = await newAxios(req, res, {
                baseURL: COUPON_SERVICE,
                url: `/coupon/postAllCoupon`,
                method: "POST",
                data: { coupon }
            })
            return (await result).data?.data || []
        } catch (error) {
            console.log("something went wrong", error);
            return Promise.reject({ error: true, status: 422, message: error })
        }
    }

}

module.exports = new CouponService();

