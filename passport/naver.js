var NaverStrategy = require('passport-naver').Strategy;
var config = require('../config/config');

module.exports = function(app,passport){
    return new NaverStrategy({
        clientID: config.naver.clientID,
        clientSecret: config.naver.clientSecret,
        callbackURL: config.naver.callbackURL
	},
    function(accessToken, refreshToken, profile, done) {
        var database = app.get('database');
        database.UserModel.findOne({
            'naver.id': profile.id
        }, function(err, user) {
            if (!user) {
                user = new database.UserModel({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    username: profile.displayName,
                    provider: 'naver',
                    naver: profile._json
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
//               console.log('name : ' + profile.displayName + ', ' + 'email : ' +  profile.email + ', ' + 'username : ' + profile.displayName + ', ' + 'naver : ' + profile._json);
            } else {
                return done(err, user);
            }
        });
    });
};