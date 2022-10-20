const axios = require('axios');

module.exports = {
    newAxios: (req, res, option) => {
        let token = req.headers['x-auth-token'];
        if (token) {
            let headers = {
                'x-auth-token': token
            }
            const client = axios.create({
                headers: headers,
                json: true
            });
            return client(option).catch(function (error) {
                return Promise.reject(error);
            });
        } else {
            let error = new Error("token is required!");
            error.status = 401;
            return Promise.reject(error);
        }
    },
    internelApi: (req, res, option, token) => {
        let headers = {
            'x-auth-token': token || process.env.ACCESS_TOKEN
        }
        const client = axios.create({
            headers: headers,
            json: true
        });
        return client(option).catch(function (error) {
            return Promise.reject(error);
        });
    },
    newAxiosWithoutAuth: (req, res, option) => {
         const client = axios.create({
            json: true
        });
        return client(option).catch(function (error) {
            return Promise.reject(error);
        });
    }
}
