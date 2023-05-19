const express = require('express');
const cors = require('cors');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');
const helmet = require('helmet');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const adRoutes = require('./routes/ads.routes');
const userRoutes = require('./routes/users.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

if(process.env.NODE_ENV !== 'production') {
    app.use(
        cors({
            origin: ['http://localhost:3000'],
            credentials: true,
        })
    );
}
app.use(helmet());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '/client/build')));
app.use(express.static(path.join(__dirname, '/public')));

const NODE_ENV = process.env.NODE_ENV;
let dbUri = '';

if(NODE_ENV === 'production') dbUri = 'url to remote db';
else dbUri = 'mongodb://127.0.0.1:27017/AdvertBoard';

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', () => {
    console.log('Connected to the database');
});
db.on('error', err => console.log('Error ' + err));

app.use(session({
    secret: process.env.secretsession,
    store: MongoStore.create(db),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV == 'production',
    }, }));

app.use('/api', adRoutes);
app.use('/api', userRoutes);
app.use('/auth', authRoutes);

//app.get('*', (req, res) => {
//    res.sendFile(path.join(__dirname, '/client/build/index.html'));
//});


app.use((req, res) => {
    res.status(404).send('404 not found...');
});

const server = app.listen('8000', () => {
    console.log('Server is running on port: 8000');
});

module.exports = server;
