'use strict';

import pkg from 'mongoose';
import MLV from 'mongoose-lean-virtuals';

const { Schema, model } = pkg;

const commentSchema = new Schema(
	{
		id: { type: Number },
		image_dir: { type: String },
		sender: { type: String },
		avatar: { type: String },
		receiver: { type: String },
		comment: { type: String },
		like: [{ type: String }],
		dislike: [{ type: String }]
	},
	{
		versionKey: false,
		timestamps: true
	}
);

commentSchema.plugin(MLV);

commentSchema.virtual('totalLikes').get(function () {
	return this.like.length;
});

commentSchema.virtual('totalDislikes').get(function () {
	return this.dislike.length;
});

export default model('Comment', commentSchema);
