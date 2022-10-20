const { newAxios, newAxiosWithoutAuth, internelApi } = require('.');
const USER_SERVICE = process.env.USER_SERVICE_BASE_URL;



class UserService {


    verifyToken = async (req, res) => {
        try {
            let result = await newAxios(req, res, {
                baseURL: USER_SERVICE,
                url: `/user/tokenAuth`,
                method: "GET"
             
            })
            return result.data || [];
        } catch (error) {
            console.log("something went wrong", error.response.data.message);
            return Promise.reject({ error: true, status: 422, message: error.response.data.message })
        }
    }




    userData = async (req, res) => {
        try {
            let result = await newAxios(req, res, {
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
    userDataPost = async (req, res, users) => {
        try {
            let result = await newAxios(req, res, {
                baseURL: USER_SERVICE,
                url: `/user/postUser`,
                method: "POST",
                data: { users }
            })
            return (await result).data?.data || [] 
        } catch (error) {
            console.log("something went wrong pls Check", error);
            return Promise.reject({ error: true, status: 422, message: error })
        }
    }



}

module.exports = new UserService();

