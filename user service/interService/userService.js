const { newAxios, newAxiosWithoutAuth, internelApi } = require('.'),
    USER_SERVICE = process.env.USER_SERVICE_BASE_URL;
// const UTILS = require('../utils');

class UserService {

    // getArtistListByIds = async (req, res, data) => {
    //     try {
    //         let result = await newAxios(req, res, {
    //             baseURL: USER_SERVICE,
    //             url: `/v1/artist`,
    //             method: "GET",
    //             data: {
    //                 ...data //Payloads
    //             }
    //         });
    //         return result.data.data || [];
    //     } catch (error) {
    //         console.log("errrr", error);
    //         return Promise.reject({ error: true, status: 422, message: error })
    //     }
    // }
    // sendMail = async (req, res, data) => {
    //     try {
    //         let result = await newAxios(req, res, {
    //             baseURL: USER_SERVICE,
    //             url: `/v1/user/sendEmail`,
    //             method: "POST",
    //             data: {
    //                 ...data //Payloads
    //             }
    //         });
    //         return result.data.data || [];
    //     } catch (error) {
    //         console.log("errrr", error);
    //         return Promise.reject({ error: true, status: 422, message: error })
    //     }
    // }
    getUserList = async (req, res, data) => {
        try {
            let result = await newAxiosWithoutAuth(req, res, {
                baseURL: USER_SERVICE,
                url: `/user/getUser`,
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
    // artistList = async (req, res, data) => {
    //     try {
    //         let result = await newAxios(req, res, {
    //             baseURL: USER_SERVICE,
    //             url: `/v1/artist/list`,
    //             method: "POST",
    //             data: {
    //                 artists: data
    //             }
    //         });
    //         return result.data.data || [];
    //     } catch (error) {
    //         console.log("errrr", error);
    //         return Promise.reject({ error: true, status: 422, message: error })
    //     }
    // }
    // artistPreferredList = async (req, res, data) => {
    //     try {
    //         let result = await newAxios(req, res, {
    //             baseURL: USER_SERVICE,
    //             url: `/v1/artist/list/preferredService`,
    //             method: "POST",
    //             data: {
    //                 artists: data
    //             }
    //         });
    //         return result.data.data || [];
    //     } catch (error) {
    //         console.log("errrr", error);
    //         return Promise.reject({ error: true, status: 422, message: error })
    //     }
    // }
    // userList = async (req, res, data) => {
    //     try {
    //         let result = await newAxios(req, res, {
    //             baseURL: USER_SERVICE,
    //             url: `/v1/user/list`,
    //             method: "POST",
    //             data: {
    //                 ...data //Payloads
    //             }
    //         })
    //         return result.data.data || [];
    //     } catch (error) {
    //         console.log("errrr", error);
    //         return Promise.reject({ error: true, status: 422, message: error })
    //     }
    // }
    // updateCustomGratuity = async (req, res, data) => {
    //     try {
    //         let result = await newAxios(req, res, {
    //             baseURL: USER_SERVICE,
    //             url: `/v1/user/updatecustomGratuity`,
    //             method: "POST",
    //             data: {
    //                 ...data //Payloads
    //             }
    //         })
    //         return result.data.data || [];
    //     } catch (error) {
    //         console.log("errrr", error);
    //         return Promise.reject({ error: true, status: 422, message: error })
    //     }
    // }
    // updateProfile = async (req, res, data) => {
    //     try {
    //         let result = await newAxios(req, res, {
    //             baseURL: USER_SERVICE,
    //             url: `/v1/artist/profile`,
    //             method: "PUT",
    //             data: {
    //                 ...data //Payloads
    //             }
    //         })
    //         return result.data.data || [];
    //     } catch (error) {
    //         console.log("errrr", error);
    //         return Promise.reject({ error: true, status: 422, message: error })
    //     }
    // }
    // updateArtist = async (req, res, data) => {
    //     try {
    //         let result = await newAxios(req, res, {
    //             baseURL: USER_SERVICE,
    //             url: `/v1/user/profile/update`,
    //             method: "PUT",
    //             data: {
    //                 ...data //Payloads
    //             }
    //         })
    //         return result.data.data || [];
    //     } catch (error) {
    //         console.log("errrr", error);
    //         return Promise.reject({ error: true, status: 422, message: error })
    //     }
    // }

    // sendPushNotification = async (data) => {
    //     try {
    //         let token = UTILS.tempToken({})
    //         let result = internelApi(null, null, {
    //             baseURL: USER_SERVICE,
    //             url: `/v1/user/notification`,
    //             method: "POST",
    //             data: {
    //                 ...data
    //             }
    //         }, token);
    //         return result.data || [];
    //     } catch (error) {
    //         console.log("errrr", error);
    //         return Promise.reject({ error: true, status: 422, message: error })
    //     }
    // }

    // sendMailIntenal = async (data) => {
    //     try {
    //         let token = UTILS.tempToken({})
    //         return await internelApi(req, res, {
    //             baseURL: USER_SERVICE,
    //             url: `/v1/user/sendEmail`,
    //             method: "POST",
    //             data: {
    //                 ...data //Payloads
    //             }
    //         }, token);
    //     } catch (error) {
    //         console.log("errrr", error);
    //         return Promise.reject({ error: true, status: 422, message: error })
    //     }
    // }

    // getCitiesList = async (req, res, data) => {
    //     try {
    //         let result = await newAxios(req, res, {
    //             baseURL: USER_SERVICE,
    //             url: `/v1/services/cities?serviceIds=${JSON.stringify(data)}`,
    //             method: "GET"
    //         });
    //         return result.data.data || [];
    //     } catch (error) {
    //         console.log("errrr", error);
    //         return Promise.reject({ error: true, status: 422, message: error })
    //     }
    // }

    // processEvent = async (req, res, data) => {
    //     try {
    //         console.log("DATA : ", data)
    //         let result = await newAxios(req, res, {
    //             baseURL: USER_SERVICE,
    //             url: `/v1/user/processEvent`,
    //             method: "POST",
    //             data: {
    //                 ...data
    //             }
    //         });
    //         return result.data.data || [];
    //     } catch (error) {
    //         console.log("errrr", error);
    //         return Promise.reject({ error: true, status: 422, message: error })
    //     }
    // }

    // processEventInternel = async (req, res, data) => {
    //     try {
    //         let token = UTILS.tempToken({})
    //         return await internelApi(req, res, {
    //             baseURL: USER_SERVICE,
    //             url: `/v1/user/processEvent`,
    //             method: "POST",
    //             data: {
    //                 ...data //Payloads
    //             }
    //         }, token);
    //     } catch (error) {
    //         console.log("errrr", error);
    //         return Promise.reject({ error: true, status: 422, message: error })
    //     }
    // }

    // userListInternel = async (req, res, data) => {
    //     try {
    //         let token = UTILS.tempToken({})
    //         let result = await internelApi(req, res, {
    //             baseURL: USER_SERVICE,
    //             url: `/v1/user/list`,
    //             method: "POST",
    //             data: {
    //                 ...data //Payloads
    //             }
    //         }, token)
    //         return result.data.data || [];
    //     } catch (error) {
    //         console.log("errrr", error);
    //         return Promise.reject({ error: true, status: 422, message: error })
    //     }
    // }
}

module.exports = new UserService();

