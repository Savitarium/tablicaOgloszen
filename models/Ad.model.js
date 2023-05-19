const mongoose = require('mongoose');
const User = require('./User.model');

const adSchema = new mongoose.Schema({
    image: { type: String, require: true },
    location: { type: String, require: true },
    price: { type: String, require: true },
    publication_date: { type: String, require: true },
    text: { type: String, require: true },
    title: { type: String, require: true },
    user_info: { type: String, require: true, ref: 'User' },
})

module.exports = mongoose.model('Ad', adSchema);