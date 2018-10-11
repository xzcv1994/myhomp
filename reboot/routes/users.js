module.exports = function(Passport){
    var express = require('express');
    var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//local 로그인
router.route('/login').post(Passport.authenticate('local-login',{
    successRedirect : '/loginsuccess',
    failureRedirect : '/'
}));

//local 회원가입
router.route('/adduser/submit').post(Passport.authenticate('local-signup',{
    successRedirect : '/',
    failureRedirect : '../../makeaccount.html'
}));

//Naver-login route
router.route('/auth/naver').get(Passport.authenticate('naver', {
        failureRedirect: '#!/auth/login'
    }));

//Naver-callback Url
router.route('/auth/naver/callback').get(Passport.authenticate('naver', {
         successRedirect : '/loginsuccess',
        failureRedirect: '#!/auth/login'
    }));

//회원가입창 띄우기
router.get('/adduser',function(req,res){
    console.log('adduser 호출');
    res.redirect('../../makeaccount.html');
});

//logout
router.get('/logout',function(req,res){
    console.log('logout 호출됨');
    
    req.session.destroy(function(err){
        if(err){throw err;}
        
        console.log('세션삭제후 로그아웃');
    });
})

//login 성공시 route
//router.get('/loginsuccess',function(req,res){
//     if(req.user){
//    res.render('main2.jade');
//   //startsocket(req.session.passport.user.email);
//} else{
//    res.render('main.jade');
//}
//});

    return router;
};