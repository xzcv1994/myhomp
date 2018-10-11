var LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
    usernameField : 'id',
    passwordField : 'password',
    passReqToCallback : true
},function(req,id,password,done){
    
    console.log('passport의 local-login 호출');
    var database = req.app.get('database');
    
    database.UserModel.findOne({'email' : id}, function(err,user){
        if(err){
            conosl.log('error')
            return done(err);
        }
        
        if(!user){
            console.log('계정이 일치하지 않음');
            return done(null,false);
        }
        
        var authenticated = user.authenticate(password,user._doc.salt,user._doc.hashed_password);
        
        if(!authenticated){
            console.log('비밀번호 틀림');
            return done(null,false);
        }
        
        console.log('계정과 비밀번호가 일치함');
        return done(null,user);
    });
})