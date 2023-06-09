const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    avatar: { type: String, require: true },
    login: { type: String, require: true },
    password: { type: String, require: true },
    phone: { type: String, require: true },
})

module.exports = mongoose.model('User', userSchema);