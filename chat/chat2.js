module.exports = function(app){
    var express = require('express');
    var router = express.Router();
    var mongoose = require('mongoose');
    var url = require('url');
    
    router.get('/chatadd',function(req,res){
        
        var database = req.app.get('database');
        var user = req.user.email;
        
        //등록하려는 상대방의 아이디를 검색
        database.UserModel.findOne({'email' : req.query.receiver} , function(err,user){
            if(err){
                console.log('error');
                res.send('<script type = "text/javascript"> alert("erreor");document.location.href="/users/loginsuccess";</script>');
            }
            
            //등록하고자 하는 상대방이 존재하지 않는다면 과 존재한다면
            if(!user){
                console.log('존재하지 않는 계정입니다.');
                res.send('<script type = "text/javascript"> alert("존재하지 않는 계정입니다.");document.location.href="/users/loginsuccess";</script>');
            }else if(user){
                
                database.ChatModel.findOne({'host' : req.user.email, 'contact_person' : req.query.receiver},function(err,chatroom){
                    if(err){
                        throw err;
                    }
                    
                    if(!chatroom){
                                            
                        console.log('해당계정을 채팅방에 등록합니다.');
                
                //host와 contact_person의 이름으로 각각 채팅방 인스턴스 생성
                var chat1 = new database.ChatModel({
                    'host' : req.user.email,
                    'contact_person' : req.query.receiver                 
                });
                
                var chat2 = new database.ChatModel({
                    'host' : req.query.receiver,
                    'contact_person' : req.user.email                 
                });
                
                //host와 contact_person의 이름으로 각각 채팅방 인스턴스 저장
                chat1.save(function(err){
                    if(err){
                        throw err;
                    }
                    console.log('chat1 데이터 추가완료');
                });
                
                chat2.save(function(err){
                    if(err){
                        throw err;
                    }
                    console.log('chat2 데이터 추가완료');
                });
                

                res.send('<script type = "text/javascript"> alert("해당계정을 채팅방에 등록합니다."); document.location.href="/users/loginsuccess";</script>');
                    }else if(chatroom){
                        res.send('<script type = "text/javascript"> alert("해당계정과의 채팅방이 이미 존재합니다."); document.location.href="/users/loginsuccess";</script>');
                    }
                });               
            }
        });
    });
    
    router.get('/open',function(req,res){
        
        var querydata = url.parse(req.url,true).query;
        console.log(querydata);
        console.log('채팅방을 열겠습니다.');
        var database = req.app.get('database');
        
        database.Message_Model.find({'sender' : req.user.email, 'receiver' : querydata.guest} || {'sender' : querydata.guest, 'receiver' : req.user.email}, function(err,data){
            if(err){
                console.dir(err);
                throw err;
            }else{
                
                 var chat_data = [];
                    
                    //"string" 형태로 변환해서 새 배열에 저장
                    for(var i=0;i<data.length;i++)
                        {
                            chat_data[i] = '"' + data[i]._doc.message + '"';
                            console.log(chat_data[i]);
                        }
                var sender = req.user.email;
 
                //대화로그가 없을 때
                if(data.length == 0){
                    console.log("나눈 대화가 없습니다."); 
                    console.log(chat_data.sender)
                    console.log(chat_data[0]);
                    res.render('chat_room.jade',{chat_data : chat_data, sender : sender, receiver : querydata.guest});
                          
                }else{
                    //대화로그 페이지열며 출력
                    console.log(chat_data.sender)
                    console.log(chat_data[0]);
                   res.render('chat_room.jade',{chat_data : chat_data, sender : sender, receiver : querydata.guest});
                }
                console.log("----------------------");
            }
        })
    })
    
    return router;
};
//chatopen을 하나 추가해야겠다.
//챗목록에 있는 아이디 클릭하면 /chat/chat_open 요청 보내서 채팅방 화면으로 넘어가게잉
//190220 a태그의 url을 바꾸는 것 만으로도 서버에 request가 가능하구나;;