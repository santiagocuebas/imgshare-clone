'use strict'

import moment from 'moment';

export const timeago = timestamp => moment(timestamp).startOf('minute').fromNow();

export const getCurrentYear = () => new Date().getFullYear();
