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
                
                //방을 생성함과 동시에 방의 채팅내용을 기록할 컬렉션 생성
                database.Chat_numModel.find({},function(err,num){
                    
                    if(err){
                        throw err;
                    }
                    var serial_num = num[0]._doc.num;
                    
                    var chatlist = "chat" + serial_num;
                    
                    var Schema = require('../database/chat_data_schema').createSchema(mongoose);
                    
                    var Model = mongoose.model(chatlist,Schema);
                    
                    var chat_data1 = new Model({
                        'name' : 'f',
                        'date' : new Date()
                    });
                    
                    chat_data1.save(function(err){
                        if(err){
                            throw err;
                        }
                        
                        console.log('현재 채팅방의 개수 : ' + serial_num);
                        
                     database.Chat_numModel.update({'num' : serial_num +1},function(err,result){
                         if(err){
                             throw err;
                         }
                         
                         if(result){
                             console.log(result);
                         }
                     });                       
                    });
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
        res.redirect('../../chat_room.html')
    })
    
    return router;
};
//chatopen을 하나 추가해야겠다.
//챗목록에 있는 아이디 클릭하면 /chat/chat_open 요청 보내서 채팅방 화면으로 넘어가게잉