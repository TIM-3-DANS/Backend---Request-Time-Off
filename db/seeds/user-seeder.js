const model = require('../../app/models')

const admins = [
    new model.User({
        username: 'admin',
        password: 'admin123',
        fullname: 'Admin',
        role_id: 1,
        position: 'General Manager',
        address: 'Jakarta',
    })
]