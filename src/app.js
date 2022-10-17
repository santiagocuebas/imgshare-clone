'use strict';

import express from 'express';
import { engine } from 'express-handlebars';
import session from 'express-session';
import SequelizeStore from 'connect-session-sequelize';
import logger from 'morgan';
import passport from 'passport';
import error from 'errorhandler';
import multer from 'multer';

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from './database.js';
import * as helpers from './libs/helpers.js';
import './auth/passport.js';

// IndexRoutes
import {
	mainRoute,
	galleryRoute,
	userRoute,
	settingsRoute,
	authRoute,
	finalRoute
} from './routes/index.js';

// Initializations
const app = express();
const NewSequelizeStore = SequelizeStore(session.Store);
const __dirname = dirname(fileURLToPath(import.meta.url));

// Settings
app.set('views', join(__dirname, './views'));
app.engine('.hbs', engine({
	defaultLayout: 'main',
	layoutsDir: join(app.get('views'), 'layouts'),
	partialsDir: join(app.get('views'), 'partials'),
	extname: '.hbs',
	helpers
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
	key: 'unaclavecualquiera',
	secret: 'unacontraseñacualquiera',
	store: new NewSequelizeStore({ db: sequelize }),
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Global Variables
app.use((req, res, next) => {
	app.locals.user = req.user || null;
	next();
});

// Static Files
app.use(multer({ dest: join(__dirname, './public/uploads/temp') }).single('image'));
app.use(express.static(join(__dirname, './public')));
app.use('/uploads', express.static(join(__dirname, './uploads')));

// Routes
app.use(mainRoute);
app.use(authRoute);
app.use('/gallery', galleryRoute);
app.use('/user', userRoute);
app.use('/settings', settingsRoute);
app.use(finalRoute);

// Error Handling
if (process.env.NODE_ENV === 'development') app.use(error());

export default app;
