'use strict'

import pkg from 'mongoose';

const { Schema, model } = pkg;

const commentSchema = new Schema(
	{
		image_id: {type: Schema.Types.ObjectId},
		author: {type: String, default: 'Master'},
		avatar: {type: String, default: 'default.png'},
		comment: {type: String},
		like: {type: Number, default: 0},
		dislike: {type: Number, default: 0},
		timestamp: {type: Date, default: Date.now}
	},
	{
		versionKey: false
	}
);

commentSchema.virtual('image')
	.set(function(image) {
		this._image = image;
	})
	.get(function() {
		return this._image;
	});

export default model('Comment', commentSchema);