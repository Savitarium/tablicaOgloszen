const Ad = require('../models/Ad.model');
const sanitize = require('mongo-sanitize');
const getImageFileType = require('../utils/getImage.FileType');
const fs = require('fs');

exports.getAll = async (req, res) => {
    try {
        const ad = await Ad.find().populate('user_info', '-password'); // Pobierz wszystkie reklamy i wykonaj populację dla pola 'user_info'
        res.json(ad);
    }
    catch(err) {
        res.status(500).json({ message: err });
    }
};
exports.getId = async (req, res) => {

    try {
        const ad = await Ad.findById(req.params.id).populate('user_info', '-password');
        if(!ad) res.status(404).json({ message: 'Not found' });
        else res.json(ad);
    }
    catch(err) {
        res.status(500).json({ message: err });
    }
};

exports.post = async (req, res) => {
    try {
        const { location, price, text, title } = sanitize(req.body);
        const fileType = req.file ? await getImageFileType(req.file): 'unknown';
        if(req.file && ['image/png', 'image/jpeg', 'image/gif', 'image/jpg'].includes(fileType) && location && text && title) {
            const locationPattern = new RegExp(
                /(<\s*(strong|em)*>(([A-Za-z0-9\s])*)<\s*\/\s*(strong|em)>)|(([A-Za-z0-9\s\.])*)/,
                "g"
            );
            const pricePattern = /^[0-9.,]+$/;
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
            const userId = req.session.user.id;
            console.log(req.session.user.id);
            const currentDate = new Date();
            const newAd = new Ad({
                image: req.file.filename,
                location: location,
                price: price,
                publication_date: currentDate,
                text:text,
                title:title,
                user_info: userId
            });
            await newAd.save();
            res.json({ newAd });
        } else {
            throw new Error('Wrong input');
            if(req.file) {
                fs.unlinkSync(req.file.path);
            }
        }
    } catch(err) {
        res.status(500).json({ message: err.message });
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
            if (!textPattern.test(text)) {
                throw new Error('Invalid text');
            }
            if (!titlePattern.test(title)) {
                throw new Error('Invalid title');
            }
        const currentDate = new Date();
        ad.location = location;
        ad.price = price;
        ad.publication_date = currentDate;
        ad.text = text;
        ad.title = title;

        const edAd = await ad.save();
        res.json({ edAd });
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
};
exports.delete = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) {
            return res.status(404).json({ message: 'Not found...' });
        }
        if (ad.image) {
            try {
                fs.unlinkSync(`public/uploads/${ad.image}`);
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    throw error;
                }
            }
        }
        await Ad.deleteOne({ _id: req.params.id });

        res.json(await Ad.find().populate('user_info', '-password'));
    } catch(err) {
        res.status(500).json({ message: err });
    }
};
exports.searchPhrase = async (req, res, next) => {
    const { searchPhrase } = req.params;
    try {
        const ads = await Ad.find({ $text: { $search: searchPhrase } });
        if (!ads) return res.status(404).json({ message: 'Ad not found' });
        else res.json(ads);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


