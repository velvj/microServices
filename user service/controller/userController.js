const db = require('../models')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const userData = db.user;
const { Op } = require("sequelize");
const nodemailer = require('nodemailer');
require("dotenv").config()

//create node mailer

const userMail = async (name, email, password) => {

    try {
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
            subject: 'hello this is verify email',
            text: `hi ${name} welcome this your mailID:  ${email} uniqueData: ${password}`,
            // html: '<p>You requested for email verification, kindly use this <a href="http://localhost:3000/user/verify-tokenEmail/' + password + '">link</a> to verify your email address</p>',
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

//verfication Email

const VerifyEmail = async (req, res) => {
    try {
        const Email = req.body.email
        console.log(Email);
        const user = await userData.findOne({ where: { email: Email } })
        if (user) {
            const token = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN)
            userMail(user.name, user.email, token)
            res.status(200).send({ status: 200, success: true, msg: "please check inbox" })
        }
        else {
            res.status(400).send({ error: "User with this email not found" })
        }
    } catch (error) {
        res.status(400).send({ status: 400, success: false, msg: error.message })
    }
}


//after get email

const clickMail = async (req, res) => {
    try {
        const tokenData = req.params.token
        const decoded = jwt.verify(tokenData, process.env.ACCESS_TOKEN);
        if (!decoded) return res.status(403).json({ status: 403, message: "The user email id does not exists" })
        else {

            const result = await userData.update({ isVerified: true }, { where: { email: decoded.email } })
            return res.status(200).send({ status: 200, message: "email ID verified  successfully" })
        }
    } catch (err) {
        res.status(400).send({ status: 400, success: false, msg: err.message })
    }
}


//Reset Password
const resetPassword = async (req, res) => {
    try {
        const id = req.params.id

        const newUser = await userData.findOne({ where: { customerID: id } })
        const compare = await bcrypt.compare(req.body.password, newUser.password)
        if (compare) return res.status(400).send({ status: 400, message: "password is already exsits" })
        if ((req.body.password !== req.body.confirmPassword)) {
            return res.status(404).send({
                message: 'password does not match'
            })
        }
        if (!newUser) {
            return res.status(404).send({
                message: 'user not found'
            })
        }
        const passData = await bcrypt.hash(req.body.password, 10)
        const result = await userData.update({ password: passData }, { where: { customerID: newUser.customerID } })
        res.status(200).send({ status: 200, message: "password Reset  successfully", data: result })
    }
    catch (err) {
        res.status(400).send({ status: 400, message: "something went wrong" || err })
    }
}

//createUser

const createUser = async (req, res) => {
    try {
        let email = req.body.email
        let phone = req.body.phone
        const clientExist = await userData.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { phone: phone }
                ]
            }
        });
        if (clientExist) {

            return res.status(400).json({ status: 400, message: "User already exists" });
        }
        else {
            const salt = await bcrypt.hash(req.body.password, 10)
            const userCollection = await userData.create({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: salt


            })
            const savedUser = await userCollection.save()
            userMail(savedUser.name, savedUser.email, req.body.password)
            return res.status(200).send({ status: 200, message: "users created successfully", data: savedUser })


        }
    } catch (err) {
        return res.status(400).json({ status: 400, message: err.message || err });
    }
}



const getUser = async (req, res) => {
    try {
        let myData = await userData.findAll({})
        res.status(200).send({ status: 200, message: "users details viewed successfully", data: myData })
    } catch (err) {
        res.status(400).send({ status: 400, message: "something went wrong" || err })
    }
}

const postUser = async (req, res) => {
    try {
        let myData = await userData.findAll({
            where: {
                customerID: {
                    [Op.in]: req.body.users
                }
            }, raw: true
        })
        return res.status(200).send({ status: 200, message: "users details viewed successfully", data: myData })
    } catch (err) {
        return res.status(400).send({ status: 400, message: "something went wrong" || err })
    }
}

//getUser ID

const getUserId = async (req, res) => {
    try {
        const Id = req.params.id
        const findID = await userData.findOne({ where: { customerID: Id } })
        res.status(200).send({ status: 200, message: "users details viewed successfully", data: findID })
    } catch (err) {
        res.status(400).send({ status: 400, message: "something went wrong" || err })
    }
}
//findByPk
const getByPk = async (req, res) => {
    const Id = req.params.id
    console.log(Id);
    try {
        const testing = await userData.findByPk(Id);
        if (testing === null) {
            res.status(400).send({ status: 400, message: "something went wrong" || err })
        } else {
            return res.status(200).send({ status: 200, message: "users details viewed successfully", data: testing })
        }
    }
    catch (err) {
        return res.status(400).send({ status: 400, message: err })
    }

}

//updateUser

const updateUser = async (req, res) => {
    try {
        const hashedPass = await bcrypt.hash(req.body.password, 10)
        const update = await userData.update({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPass,
            isVerified: req.body.isVerified
        }, { where: { customerID: req.params.id } })
        if (update) {
            return res.status(200).send({ status: 200, message: "users details updated successfully", data: update })
        }
    } catch (err) {
        return res.status(400).send({ status: 400, message: err })
    }
}


//deleteUser

const deleteUser = async (req, res) => {
    try {
        const Id = req.params.id
        const delete_user = await userData.destroy({ where: { customerID: Id } })
        console.log("successfully");
        if (!delete_user) return await res.status(200).send({ status: 200, message: "no data there", data: delete_user })
        else return await res.status(200).send({ status: 200, message: "users deleted successfully", data: delete_user })
    } catch (err) {
        res.status(400).send({ status: 400, message: err })
    }
}

//login user

const userLogin = async (req, res) => {
    try {
        let username = req.body.username;
        const user = await userData.findOne({ where: { email: username }, });
        if (user) {
            let password = req.body.password;
            const result = await bcrypt.compare(password, user.password)
            if (!result) {
                return res.status(200).json({ status: 200, message: 'password match' })
            }
            else {
                console.log(user, "login user");
                let token = jwt.sign({ "ID": user.customerID, "userType": user.isAdmin }, process.env.ACCESS_TOKEN);
                const data = { "name": user.name, "email": user.email, "phone": user.phone, "token": token };

                return res.status(200).json({ status: 200, message: 'login succesfully', data: data })
            }

        }
        else return res.status(200).json({ status: 200, message: 'username doesnt match' })
    } catch (err) {
        res.status(400).send({ status: 400, message: err })
    }
}

//delete All user
const deleteAllUser = async (req, res) => {
    try {
        const deleteAll = await userData.destroy({
            where: {},
            truncate: false
        })
        console.log(deleteAll);
        if (!deleteAll) return res.status(200).send({ status: 200, message: "no data there", data: deleteAll })
        else return res.status(200).send({ status: 200, message: "all data deleted successfully", data: deleteAll })
    } catch (err) {
        res.status(400).send({ status: 400, message: "something went wrong" || err })
    }
}

//token Auth

const tokenAuth = async (req, res, next) => {
    try {
        const token = await req.header("x-auth-token");
        if (!token) return res.status(403).json({ status: 403, message: "access denied no token provided" })
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        req.user = await userData.findOne({ where: { customerID: decoded.ID }, raw: true, attributes: { exclude: ['password', 'isVerified'] } });
        if (req.user.isAdmin === 0) {
          res.status(401).send({ status: 401, message: "user not a admin" });
        } else { 
            res.status(200).send({ status: 200, message: "Token Authenticated successfully", data:req.user }) }
        next();
    } catch (err) {
        if (err)
            err.status = res.status(403).json({ status: 403, message: err.message || err })
        next(err)

    }

}




module.exports = {
    getUser, createUser, updateUser, deleteUser, userLogin, getUserId, deleteAllUser, getByPk, userMail, resetPassword, VerifyEmail, clickMail, tokenAuth, postUser
}