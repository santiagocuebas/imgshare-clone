'use strict'

import moment from 'moment';

export const timeago = timestamp => moment(timestamp).startOf('minute').fromNow();

export const getCurrentYear = () => new Date().getFullYear();

export const isTrue = (user, name) => {
	if (user) {
		if (user.username === name) return true
		else return false
	} else return false
}
