const model = require('../../../models')
const jwt = require('jsonwebtoken')
const { genSalt, hash, compareSync } = require('bcrypt')

const encryptPassword = async (password) => {
    const salt = await genSalt(10)
    return hash(password, salt)
}

module.exports = {
    register: async (req, res) => {
        try {
            // Check if email already exists
            const isEmailExist = await model.user.findOne({
                where: {
                    email: req.body.email
                }
            })

            if (isEmailExist) throw new Error('Email already exists')

            let getUser = await model.user.create({
                ...req.body,
                password: await encryptPassword(req.body.password)
            })

            user = {
                id: getUser.id,
                fullname: getUser.fullname,
                email: getUser.email,
                role: getUser.role,
                position: getUser.position,
                address: getUser.address,
                isActive: getUser.isActive
            }

            return res.status(200).json({
                success: true,
                message: 'User successfully registered',
                error: null,
                data: user
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
                error: error,
                data: null
            })
        }
    },
    login: async (req, res) => {
        try {
            const invalidData = "username or password is invalid"

            // check if email exists
            const isEmailExist = await model.user.findOne({
                where: {
                    email: req.body.email
                }
            })

            if (!isEmailExist) throw new Error(invalidData)

            let user = isEmailExist

            // check if password is correct
            if (compareSync(req.body.password, user.password)) {
                const token = jwt.sign({
                    id: user.id,
                    fullname: user.fullname,
                    email: user.email,
                    role: user.role
                },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '1d' }
                );

                user = {
                    id: getUser.id,
                    fullname: getUser.fullname,
                    email: getUser.email,
                    role: getUser.role,
                    position: getUser.position,
                    address: getUser.address,
                    isActive: getUser.isActive
                }
            } else {
                throw new Error(invalidData)
            }

            return res.status(200).json({
                success: true,
                message: 'User successfully logged in',
                error: null,
                data: user,
                token: token
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
                error: error,
                data: null
            })
        }
    }
}