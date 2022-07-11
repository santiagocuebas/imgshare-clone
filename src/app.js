
import express from 'express';
import { engine } from 'express-handlebars';
import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import logger from 'morgan';
import passport from 'passport';
import flash from 'connect-flash';
import error from 'errorhandler';
import multer from 'multer';

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { PORT } from './keys.js';
import pool from './database.js';
import * as helpers from './helpers.js';
import './database.js';
import './lib/passport.js';

// IndexRoutes
import iRoutes from './routes/index.js';
import aRoutes from './routes/auth.js';

// Initializations
const app = express();
const sessionStore = new MySQLStore({}, pool);
const __dirname = dirname(fileURLToPath(import.meta.url));

// Settings
app.set('views', join(__dirname, 'views'));
app.engine('.hbs', engine({
	defaultLayout: 'main',
	layoutsDir: join(app.get('views'), 'layouts'),
	partialsDir: join(app.get('views'), 'partials'),
	extname: '.hbs',
	helpers: helpers
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(logger('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
	key: 'unaclavecualquiera',
	secret: 'unacontraseñacualquiera',
	store: sessionStore,
	resave: false,
	saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(multer({dest: './uploads/'}).single('image'));

// Global Variables
app.use((req, res, next) => {
	app.locals.user = req.user;
	next();
});

// Routes
app.use(iRoutes);
app.use(aRoutes);

// Static Files
app.use(express.static(join(__dirname, 'public')));

// Error Handling
if ('development' === process.env.NODE_ENV) app.use(error());

//LISTENER
app.listen(PORT);
console.log('Server on port', PORT);
