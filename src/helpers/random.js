'use strict'

export const random = () => {
	const possible = 'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789';
	let randomNumber = 0;
	for (let i = 0; i < 7; i++) {
		randomNumber += possible.charAt(Math.floor(Math.random() * possible.length));
	};
	return randomNumber;
};
