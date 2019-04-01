module.exports = function(Passport,app){
    var express = require('express');
    var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//local 로그인
router.route('/login').post(Passport.authenticate('local-login',{
    successRedirect : '/users/loginsuccess',
    failureRedirect : '/users/loginfailure'
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
         successRedirect : '/users/loginsuccess',
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
        res.redirect('/');

    });
})

//login 성공시 route
router.get('/loginsuccess',function(req,res){
    if(req.user){
        var database = req.app.get('database');
        var chatlist;

        database.Chat_Model.find({'host' : req.user.email},function(err,chatroom){
            if(err) throw err;

            if(chatroom == undefined){
                console.log('생성한 채팅방이 없습니다.');
            }

            if(chatroom){
                
                var chat_list = new Array();
                
                for(var i=0;i<chatroom.length;i++){
                    chat_list[i] = chatroom[i]._doc.contact_person;
                }
                
                console.dir(chat_list);
                var user_info = chatroom;
                user_info.user = req.user.email;
                user_info.length = chatroom.length;
                 res.render('main2.jade',{user_info : user_info, chat_list : chat_list});
            }else{
                
            }
        });       
    }
    else{
   res.redirect('/');
   }

});

router.get('/loginfailure',function(req,res){
    console.log('login실패')
    res.send('<script type = "text/javascript"> alert("ID 또는 PASSWORD를 확인해주세요."); document.location.href="/";</script>');
});

    return router;
};
