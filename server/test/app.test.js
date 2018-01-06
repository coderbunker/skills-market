/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const request = require('request');

describe('Test NodeJS API', () => {
  const url = 'http://localhost:3000/api/v1';

  it('Request /users - return 46 users', (done) => {
    const urlUsers = `${url}/users`;
    request(urlUsers, (error, response, body) => {
      const json = JSON.parse(body);
      // eslint-disable-next-line jest/valid-expect
      expect(JSON.parse(json.users.length)).to.equal(46);
      done();
    });
  });

  it('Request /skills - return 30 skills', (done) => {
    const urlSkills = `${url}/skills`;
    request(urlSkills, (error, response, body) => {
      const json = JSON.parse(body);
      expect(json.length).to.equal(14);
      done();
    });
  });

  it('Request /register - return tx hash', (done) => {
    const urlRegister = `${url}/register/Ricky/React`;
    request.post(urlRegister, (error, response, body) => {
      expect(body).to.equal('user was successfully registered');
      done();
    });
  });

  it('Request /help - return positive response', (done) => {
    const urlAskForHelp = `${url}/help/Dmitry/React/10`;
    request.post(urlAskForHelp, (error, response, body) => {
      const json = JSON.parse(body);
      expect(json.success).is.equal(true);
      expect(json.payload.length).not.equal(0);
      done();
    });
  });

  it('Request /help - return negative response', (done) => {
    const urlAskForHelp = `${url}/help/Joe/React/10`;
    request.post(urlAskForHelp, (error, response, body) => {
      expect(body).equal('User is not valid');
      done();
    });
  });

  /** eslint-disable no-unused-vars */

  it(`Request /mentoring - mentee with request is exist -${
    +' return positive response'}`, (done) => {
    const urlAskForHelp = `${url}/help/Dmitry/React/10`;
    request.post(urlAskForHelp, () => {
      // help request should go after submitted user
      const urlMentoring = `${url}/mentoring/Ricky/Dmitry/React/10`;
      request.post(urlMentoring, (error, response, body) => {
        const json = JSON.parse(body);
        expect(json.success).is.equal(true);
        expect(json.payload.length).not.equal(0);
        done();
      });
    });
  });

  /** eslint-enable no-unused-vars */

  it(`Request /mentoring - mentee with request isn't exist -${
    +' return negative response'}`, (done) => {
    const urlMentoring = `${url}/mentoring/Ricky/Joe/React/10`;
    request.post(urlMentoring, (error, response, body) => {
      expect(body).equal('User is not registered');
      done();
    });
  });

  // it("Request /dashboard - return history of transactions", function(done) {
  //     // TODO complete me when you finish function with tx hash
  //     var urlDashboard = url + "/dashboard";
  //     request(urlDashboard, function(error, response, body) {
  //         // TODO find a way setup test environment
  //         // TODO it also should solve timeout issue
  //         var json = JSON.parse(body);
  //         expect(json.length).not.equal(0);
  //         done();
  //     });
  // });

  it('Request /validate - positive scenario - return receipt', (done) => {
    const urlAskForHelp = `${url}/help/Dmitry/React/10`;
    request.post(urlAskForHelp, (error, response, body) => {
      const json = JSON.parse(body);
      const urlValidate = `${url}/validate/${json.payload}`;
      request.get(urlValidate, (validateError, validateResponse, validateBody) => {
        const validateJson = JSON.parse(validateBody);
        expect(validateJson.success).is.equal(true);
        done();
      });
    });
  });

  it('Request /validate - negative scenario - return error message', (done) => {
    // TODO complete me when you finish function with tx hash
    // 'No receipt for this txHash'
    const urlValidate = `${url}/validate/0x37049`;
    request.get(urlValidate, (error, response, body) => {
      const json = JSON.parse(body);
      expect(json.success).is.equal(false);
      done();
    });
  });
});
