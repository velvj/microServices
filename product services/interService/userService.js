const { newAxios, newAxiosWithoutAuth, internelApi } = require('.');
const  USER_SERVICE = process.env.USER_SERVICE_BASE_URL;
// const UTILS = require('../utils');

class UserService {
    userData = async (req, res) => {
        try {
            let result = await newAxiosWithoutAuth(req, res, {
                baseURL: USER_SERVICE,
                url: `/user/getUser`,
                method: "GET"
            })
            return result.data || [];
        } catch (error) {
            console.log("something went wrong", error);
            return Promise.reject({ error: true, status: 422, message: error })
        }
        }
 
} 

module.exports = new UserService();

