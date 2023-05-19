const User = require('../models/User.model');
const sanitize = require('mongo-sanitize');
const bcrypt = require('bcryptjs');
const getImageFileType = require('../utils/getImage.FileType');
const fs = require('fs');

exports.register = async (req, res) => {
    try {
        const { login, password, phone } = sanitize(req.body);
        console.log(req.body, req.file);
        const fileType = req.file ? await getImageFileType(req.file) : 'unknown';
        if (login && typeof login === 'string' && password && typeof password === 'string' && phone && req.file && ['image/png', 'image/jpeg', 'image/gif'].includes(fileType)) {

            const phonePattern = /^[0-9]+$/;
            if (!phonePattern.test(phone)) {
                throw new Error('Invalid phone');
            }
            const userWithLogin = await User.findOne({ login });
            if (userWithLogin) {
                if(req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(409).send({ message: 'User with this login already exists' });
            }

            const user = await User.create({ login: login, password: await bcrypt.hash(password, 10), avatar: req.file.filename, phone: phone });
            res.status(201).json({ message: 'User created ' + user.login });
        } else {
            if(req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(400).json({ message: 'Bad request' });
        }
    } catch(err) {
        if(req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: err });
    }
};

exports.login = async (req, res) => {
    try {
        const { login, password } = sanitize(req.body);
        if (login && typeof login === 'string' && password && typeof password === 'string') {
            const user = await User.findOne({ login });
            if (!user) {
                res.status(400).json({ message: 'User or password are incorrect' });
            } else {
                if (bcrypt.compareSync(password, user.password)) {
                    req.session.user = { login: user.login, id: user._id };
                    res.status(200).json({ message: 'Login successful' });
                } else {
                    res.status(400).json({ message: 'User or password are incorrect' });
                }
            }
        } else {
            res.status(400).send({ message: 'Bad request' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getUser = async (req, res) => {
   res.send('Użytkownik zalogowany');
};
exports.logout = async (req, res) => {
    req.session.destroy();
    res.send('Użytkownik wylogowany');
}