'use strict'

import pkg from 'mongoose';
import MLV from 'mongoose-lean-virtuals';
import { extname } from 'path';

const { Schema, model } = pkg;

const imageSchema = new Schema(
	{
		title: {type: String, required: true, trim: true},
		description: {type: String, trim: true},
		filename: {type: String},
		views: {type: Number, default: 0},
		likes: {type: Number, default: 0},
		dislikes: {type: Number, default: 0},
		timestamp: {type: Date, default: Date.now},
		author: {type: String, default: 'Master'},
		avatar: {type: String, default: 'default.png'}
	},
	{
		versionKey: false,
		timestamps: true
	}
);

imageSchema.plugin(MLV);

imageSchema.virtual('uniqueId').get(function() {
	return this.filename.replace(extname(this.filename), '');
});

export default model('Image', imageSchema);
