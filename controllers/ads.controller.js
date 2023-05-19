const Ad = require('../models/Ad.model');
const sanitize = require('mongo-sanitize');
const getImageFileType = require('../utils/getImage.FileType');
const fs = require('fs');

exports.getAll = async (req, res) => {
    try {
        const ad = await Ad.find().populate('user_info', '-pass'); // Pobierz wszystkie reklamy i wykonaj populację dla pola 'user_info'
        res.json(ad);
    }
    catch(err) {
        req.status(500).json({ message: err });
    }
};
exports.getId = async (req, res) => {

    try {
        const ad = await Ad.findById(req.params.id).populate('user_info', '-pass');
        if(!ad) res.status(404).json({ message: 'Not found' });
        else res.json(ad);
    }
    catch(err) {
        res.status(500).json({ message: err });
    }
};

exports.post = async (req, res) => {
    try {
        const { location, price, publication_date, text, title } = sanitize(req.body);
        const fileType = req.file ? await getImageFileType(req.file): 'unknown';
        if(req.file && ['image/png', 'image/jpeg', 'image/gif'].includes(fileType) && location && publication_date && text && title) {
            const locationPattern = new RegExp(
                /(<\s*(strong|em)*>(([A-Za-z0-9\s])*)<\s*\/\s*(strong|em)>)|(([A-Za-z0-9\s\.])*)/,
                "g"
            );
            const pricePattern = /^[0-9]+$/;
            const publication_datePattern = /^[\d.]+$/;
            const textPattern = new RegExp(
                /(<\s*(strong|em)*>(([A-Za-z0-9\s])*)<\s*\/\s*(strong|em)>)|(([A-Za-z0-9\s\.])*)/,
                "g"
            );
            const titlePattern = new RegExp(
                /(<\s*(strong|em)*>(([A-Za-z0-9\s])*)<\s*\/\s*(strong|em)>)|(([A-Za-z0-9\s\.])*)/,
                "g"
            );
            if (!locationPattern.test(location)) {
                throw new Error('Invalid location');
                if(req.file) {
                    fs.unlinkSync(req.file.path);
                }
            }
            if (!pricePattern.test(price)) {
                throw new Error('Invalid price');
                if(req.file) {
                    fs.unlinkSync(req.file.path);
                }
            }
            if (!publication_datePattern.test(publication_date)) {
                throw new Error('Invalid date');
                if(req.file) {
                    fs.unlinkSync(req.file.path);
                }
            }
            if (!textPattern.test(text)) {
                throw new Error('Invalid text');
                if(req.file) {
                    fs.unlinkSync(req.file.path);
                }
            }
            if (!titlePattern.test(title)) {
                throw new Error('Invalid title');
                if(req.file) {
                    fs.unlinkSync(req.file.path);
                }
            }
            const newAd = new Ad({ image: req.file.filename, location: location, price: price, publication_date: publication_date, text:text, title:title });
            await newAd.save();
            res.json({ message: 'OK' });
        } else {
            throw new Error('Wrong input');
            if(req.file) {
                fs.unlinkSync(req.file.path);
            }
        }
    } catch(err) {
        res.status(500).json({ message: err} );
        if(req.file) {
            fs.unlinkSync(req.file.path);
        }
    }
};
exports.put = async (req, res) => {
    try {
        const { location, price, publication_date, text, title } = sanitize(req.body);
        const ad = await Ad.findById(req.params.id);
        if(!ad) {
            return res.status(404).json({ message: 'Not found...' });
        }
        const fileType = req.file ? await getImageFileType(req.file): 'unknown';
        if(req.file && ['image/png', 'image/jpeg', 'image/gif'].includes(fileType) && location && publication_date && text && title) {
            if (ad.image) {
                fs.unlinkSync(`public/uploads/${ad.image}`);
            }
            ad.image = req.file.filename;
        }
            const locationPattern = new RegExp(
                /(<\s*(strong|em)*>(([A-Za-z0-9\s])*)<\s*\/\s*(strong|em)>)|(([A-Za-z0-9\s\.])*)/,
                "g"
            );
            const pricePattern = /^[0-9]+$/;
            const publication_datePattern = /^[\d.]+$/;
            const textPattern = new RegExp(
                /(<\s*(strong|em)*>(([A-Za-z0-9\s])*)<\s*\/\s*(strong|em)>)|(([A-Za-z0-9\s\.])*)/,
                "g"
            );
            const titlePattern = new RegExp(
                /(<\s*(strong|em)*>(([A-Za-z0-9\s])*)<\s*\/\s*(strong|em)>)|(([A-Za-z0-9\s\.])*)/,
                "g"
            );
            if (!locationPattern.test(location)) {
                throw new Error('Invalid location');
            }
            if (!pricePattern.test(price)) {
                throw new Error('Invalid price');
            }
            if (!publication_datePattern.test(publication_date)) {
                throw new Error('Invalid date');
            }
            if (!textPattern.test(text)) {
                throw new Error('Invalid text');
            }
            if (!titlePattern.test(title)) {
                throw new Error('Invalid title');
            }
        ad.location = location;
        ad.price = price;
        ad.publication_date = publication_date;
        ad.text = text;
        ad.title = title;

        const updatedAd = await ad.save();
        res.json(updatedAd);
    } catch(err) {
        res.status(500).json({ message: err})
    }
};
exports.delete = async (req, res) => {
    try {
        const ad = await Ad.findByIdAndDelete(req.params.id);
        if (ad) {
            res.json(await Ad.find().populate('user_info', '-pass'));
        } else {
            res.status(404).json({ message: 'Not found...' });
        }
    } catch(err) {
        res.status(500).json({ message: err });
    }
};