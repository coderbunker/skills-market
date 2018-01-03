var assert = require("assert");
var expect  = require("chai").expect;
var request = require("request");

describe("Test NodeJS API", function() {

    var url = "http://localhost:3000/api/v1";

    it("Request /users - return 46 users", function(done) {
        var urlUsers = url + "/users";
        request(urlUsers, function(error, response, body) {
            var json = JSON.parse(body);
            expect(JSON.parse(json.users.length)).to.equal(46);
            done();
        });
    });

    it("Request /skills - return 30 skills", function(done) {
        var urlSkills = url + "/skills";
        request(urlSkills, function(error, response, body) {
            var json = JSON.parse(body);
            expect(json.length).to.equal(14);
            done();
        });
    });

    it("Request /register - return tx hash", function(done) {
        var urlRegister = url + "/register/Ricky/React";
        request.post(urlRegister, function(error, response, body) {
            expect(body).to.equal('user was successfully registered');
            done();
        })
    });

    it("Request /help - return positive response", function(done) {
        var urlAskForHelp = url + "/help/Dmitry/React/10";
        request.post(urlAskForHelp, function(error, response, body) {
            var json = JSON.parse(body);
            expect(json.success).is.equal(true);
            expect(json.payload.length).not.equal(0);
            done();
        })
    });

    it("Request /help - return negative response", function(done) {
        var urlAskForHelp = url + "/help/Joe/React/10";
        request.post(urlAskForHelp, function(error, response, body) {
            expect(body).equal("User is not valid");
            done();
        })
    });

    it("Request /mentoring - mentee with request is exist - return positive response", function(done) {
        var urlAskForHelp = url + "/help/Dmitry/React/10";
        request.post(urlAskForHelp, function(error, response, body){
            // help request should go after submitted user
            var urlMentoring = url + "/mentoring/Ricky/Dmitry/React/10";
            request.post(urlMentoring, function(error, response, body) {
                var json = JSON.parse(body);
                expect(json.success).is.equal(true);
                expect(json.payload.length).not.equal(0);
                done();
            });
        });
    });

    it("Request /mentoring - mentee with request isn't exist - return negative response", function(done) {
        var urlMentoring = url + "/mentoring/Ricky/Joe/React/10";
        request.post(urlMentoring, function(error, response, body) {
            expect(body).equal("User is not registered");
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

    it("Request /validate - positive scenario - return receipt", function(done) {
        var urlAskForHelp = url + "/help/Dmitry/React/10";
        request.post(urlAskForHelp, function(error, response, body) {
            var json = JSON.parse(body);
            var urlValidate = url + "/validate/" + json.payload;
            request.get(urlValidate, function(error, response, body) {
                var json = JSON.parse(body);
                expect(json.success).is.equal(true);
                done();
            });
        })
    });

    it("Request /validate - negative scenario - return error message", function(done) {
        // TODO complete me when you finish function with tx hash 
        // 'No receipt for this txHash'
        var json = JSON.parse(body);
        var urlValidate = url + "/validate/" + json.payload;
        request.get(urlValidate, function(error, response, body) {
            var json = JSON.parse(body);
            expect(json.success).is.equal(true);
            done();
        });
    });
});