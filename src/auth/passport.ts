
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { encryptPassword } from './crypt.js';
import { User, Image } from '../models/index.js';
import { getUser } from '../libs/services.js';

passport.use('login', new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password'
}, async (username, _password, done) => {
	const user: User | null = await getUser(username);
	
	if (user !== null) {
		let totalViews = 0;
		const images = await Image.find({ author: username });

		if (images) {
			for (const image of images) {
				totalViews += image.views;
			}

			await User.update({ totalViews }, {
				where: { username }
			});
		}

		return done(null, user);
	}
}));

passport.use('signup', new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password',
	passReqToCallback: true
}, async (req, username, password, done) => {
	const { email } = req.body;
	const newPassword: string = await encryptPassword(password);
	const user = await User.create({
		username,
		email,
		password: newPassword,
		creationDate: new Date(),
		updatedOn: new Date()
	});

	return done(null, user);
}));

passport.serializeUser((user, done) => {
	return done(null, user.username);
});

passport.deserializeUser(async (username: string, done) => {
	const user = await User.findOne({ where: { username } });
	
	if (user !== null) {
		return done(null, user);
	}
});

export default passport;
