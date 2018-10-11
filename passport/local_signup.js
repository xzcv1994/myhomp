var LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
    usernameField : 'id',
    passwordField : 'password',
    passReqToCallback : true
},function(req,id,password,done){
    var database = req.app.get('database');
     var paramName = req.body.name || req.query.name;
    console.log('passport의 local-signup 호출');
    
    process.nextTick(function(){
        database.UserModel.findOne({'email' : id}, function(err,user){
            if(err){
                return done(err);
            }
            
            if(user){
                console.log('기존에 계정이 존재합니다.');
                console.dir(user._doc.email);
                return done(null,false);
            }else{
                var user = new database.UserModel({'email' : id, 'password' : password, 'name' : paramName});
                user.save(function(err){
                    if(err){
                        throw err;
                    }
                    console.log('사용자 데이터 추가완료');
                    return done(null,user);
                });
            }
        });
    });
})