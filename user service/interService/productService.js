const { newAxios, newAxiosWithoutAuth, internelApi } = require('.'),
    PRODUCT_SERVICE = process.env.USER_SERVICE_BASE_URL;
const UTILS = require('../utils')
class ProductService {
    getAddressDetails = async (req, res, data) => {
        try {

            let result = await newAxios(req, res, {
                baseURL: PRODUCT_SERVICE,
                url: `/v1/user/address`,
                method: "GET",
                data: {
                    ...data //Payloads
                }
            });
            return result.data.data || [];

        } catch (error) {
            console.log("errrr", error);
            return Promise.reject({ error: true, status: 422, message: error })
        }
    }
    getServiceDetails = async (req, res, data) => {
        try {
            let result = await newAxios(req, res, {
                baseURL: PRODUCT_SERVICE,
                url: `/v1/user/service`,
                method: "GET",
                data: {
                    ...data //Payloads
                }
            });
            return result.data.data || [];

        } catch (error) {
            console.log("errrr", error);
            if (res)
                return Promise.reject({ error: true, status: 422, message: error })
        }
    }

    getAllServices = async (req, res, data) => {
        try {
            let result = await newAxios(req, res, {
                baseURL: PRODUCT_SERVICE,
                url: `/v1/user/services`,
                method: "GET",
                data: {
                    ...data //Payloads
                }
            });
            return result.data.data || [];

        } catch (error) {
            console.log("errrr", error);
            return Promise.reject({ error: true, status: 422, message: error })
        }
    }

    getServiceDetailsByStatus = async (req, res, data) => {
        try {
            let result = await newAxios(req, res, {
                baseURL: PRODUCT_SERVICE,
                url: `/v1/user/services/status`,
                method: "GET",
                data: {
                    ...data //Payloads
                }
            });
            return result.data.data || [];
        } catch (error) {
            console.log("errrr", error);
            return Promise.reject({ error: true, status: 422, message: error })
        }
    }

    serviceList = async (req, res, data) => {
        try {
            let result = await newAxios(req, res, {
                baseURL: PRODUCT_SERVICE,
                url: `/v1/user/service/list`,
                method: "POST",
                data: data
            });
            return result.data.data || [];
        } catch (error) {
            console.log("errrr", error);
            return Promise.reject({ error: true, status: 422, message: error })
        }
    }

    brodCastingAndAssignArtistAlog = (req, res, data) => {
        try {
            console.log("data", data);
            let result = newAxios(req, res, {
                baseURL: PRODUCT_SERVICE,
                url: `/v1/artist/assignAndBrodcast`,
                method: "POST",
                data: {
                    ...data
                }
            });
            if (result.data && result.data.data) {
                return result.data.data
            }
            return [];
        } catch (error) {
            console.log("errrrrrrrr", error);
            return Promise.reject({ error: true, status: 422, message: error })
        }
    }

    brodCastingAndAssignArtistAlog2 = (req, res, data) => {
        try {
            console.log("data", data);
            let result = internelApi(req, res, {
                baseURL: PRODUCT_SERVICE,
                url: `/v1/artist/assignAndBrodcast`,
                method: "POST",
                data: {
                    ...data
                }
            });
            if (result.data && result.data.data) {
                return result.data.data
            }
            return [];
        } catch (error) {
            console.log("errrrrrrrr", error);
            return Promise.reject({ error: true, status: 422, message: error })
        }
    }

    serviceCategories = async (req, res) => {
        try {
            let result = await newAxios(req, res, {
                baseURL: PRODUCT_SERVICE,
                url: `/v1/user/categories`,
                method: "GET",
            });
            if (result.data && result.data.data) {
                return result.data.data
            }
            return [];
        } catch (error) {
            console.log("errrrrrrrr", error);
            return Promise.reject({ error: true, status: 422, message: error })
        }
    }
}

module.exports = new ProductService()