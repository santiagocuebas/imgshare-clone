
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
import * as route from './routes/index.js';

// Initializations
const app = express();
const SessionStore = SequelizeStore(session.Store);
const __dirname: string = dirname(fileURLToPath(import.meta.url));

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
	secret: 'unacontraseñacualquiera',
	store: new SessionStore({ db: sequelize }),
	resave: false,
	saveUninitialized: false,
	cookie: {
		sameSite: 'lax'
	}
}));
app.use(passport.initialize());
app.use(passport.session());

// Global Variables
app.use((req, _res, next) => {
	app.locals.user = req.user;
	return next();
});

// Static Files
app.use(multer({ dest: join(__dirname, './public/uploads/temp') }).single('image'));
app.use(express.static(join(__dirname, './public')));
app.use('/uploads', express.static(join(__dirname, './uploads')));

// Routes
app.use(route.main);
app.use(route.auth);
app.use('/gallery', route.gallery);
app.use('/user', route.user);
app.use('/settings', route.settings);
app.use(route.final);

// Error Handling
if (process.env.NODE_ENV === 'development') app.use(error());

export default app;
