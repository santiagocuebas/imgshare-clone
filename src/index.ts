
import 'reflect-metadata';
import app from './app.js';
import { PORT } from './config.js';
import { sequelize, mongod } from './database.js';

// Connect Databases
if (mongod) console.log('MongoDB Database is Connected');
else console.error('Ha ocurrido un error con ', mongod);

try {
	await sequelize.sync({ alter: false });
	console.log('SQL Database is Connected');
} catch (e) {
	console.error(e);
}

// LISTENER
app.listen(PORT, () => {
	console.log('Server on port', PORT);
});
