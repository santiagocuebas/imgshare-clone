'use strict';

import pkg from 'mongoose';
import MLV from 'mongoose-lean-virtuals';
import { extname } from 'path';

const { Schema, model } = pkg;

const imageSchema = new Schema(
	{
		title: { type: String, required: true, trim: true },
		description: { type: String, trim: true },
		filename: { type: String },
		views: { type: Number, default: 0 },
		like: [{ type: String }],
		dislike: [{ type: String }],
		author: { type: String },
		avatar: { type: String, default: 'default.png' }
	},
	{
		versionKey: false,
		timestamps: true
	}
);

imageSchema.plugin(MLV);

imageSchema.virtual('uniqueId').get(function () {
	return this.filename.replace(extname(this.filename), '');
});

imageSchema.virtual('totalLikes').get(function () {
	return this.like.length;
});

imageSchema.virtual('totalDislikes').get(function () {
	return this.dislike.length;
});

export default model('Image', imageSchema);
