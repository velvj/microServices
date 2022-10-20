const { newAxios, newAxiosWithoutAuth, internelApi } = require('.');
const PRODUCT_SERVICE = process.env.PRODUCT_SERVICE_BASE_URL;



class ProductService {
    productData = async (req, res) => {
        try {
            let result = await newAxios(req, res, {
                baseURL: PRODUCT_SERVICE,
                url: `/product/produtsAll`,
                method: "GET"
            })
            return (await result).data || []
        } catch (error) {
            console.log("something went wrong", error);
            return Promise.reject({ error: true, status: 422, message: error })
        }
    }

productDataPage = async (req, res,data) => { 
        try { 
            let result = await newAxios(req, res, { 
                baseURL: PRODUCT_SERVICE, 
                url: '/product/postProducts', 
                method: "POST", 
                data:{ 
                    data 
                } 
            }) 
            return (await result).data?.data || [] 
        } catch (error) { 
            console.log("something went wrong", error); 
            return Promise.reject({ error: true, status: 422, message: error }) 
        } 
    }





}
   
    



module.exports = new ProductService();

