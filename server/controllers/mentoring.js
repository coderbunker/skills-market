const debug = require('debug')('endpoint-mentoring');
const http = require('../http.js');

function isMentor(mentor, mentee) {
  return mentor !== mentee;
}

module.exports = function (mentor, mentee) {
  return new Promise(((fulfill) => {
    const isM = isMentor(mentor, mentee);
    debug('is', mentor, mentee, 'his/her mentor?:', isM);
    fulfill({
      status: http.SUCCESS,
      message: isM,
    });
  }));
};
