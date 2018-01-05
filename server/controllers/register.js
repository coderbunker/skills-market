const debug = require('debug')('endpoint-register');

const util = require('util');
const http = require('../http.js');
const Promise = require('promise');

const MEMBER_MIN_NAME_LENGTH = 3;
const MEMBER_MAX_NAME_LENGTH = 20;

function correctLength(member) {
	const l = member.length;
	return l >= MEMBER_MIN_NAME_LENGTH && l <= MEMBER_MAX_NAME_LENGTH;
}

function memberExists(member) {
	return member == null;
}

module.exports = function(member) {
	return new Promise(((fulfill) => {
		debug('attempting to registering', member);
		if (!correctLength(member)) {
			debug(member, 'had incorrect length');
			const str = 'member name should be equal or longer than %s' +
				+ ' and shorter or equal to %s characters';
			fulfill({
				status: http.BAD_REQUEST,
				message: util.format(
					str,
					MEMBER_MIN_NAME_LENGTH,
					MEMBER_MAX_NAME_LENGTH
				),
			});
			return;
		}
		if (memberExists(member)) {
			debug(member, 'already exists');
			fulfill({
				status: http.BAD_REQUEST,
				message: 'member already exists',
			});
			return;
		}
		debug('successfully registered', member);
		fulfill({
			status: http.SUCCESS,
			message: `member ${member} was successfully registered`,
		});
	}));
};
