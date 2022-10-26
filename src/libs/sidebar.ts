
import { Image } from '../models/index.js';

export const recentUploads = async () => {
	const images = await Image.find()
		.limit(20)
		.sort({ createdAt: -1 })
		.lean({ virtuals: true });

	return images;
};
