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
                database.Chat_NumModel.find({},function(err,num){
                    
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
                        
                     database.Chat_NumModel.update({'num' : serial_num +1},function(err,result){
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
        var sender = req.user.email;
        var guest = querydata.guest;
        var database = req.app.get('database');
        
        database.MessageModel.find({'sender' : sender, 'receiver' : guest}, function(err,data){
            if(err){
                console.dir(err);
                throw err;
            }else{
                
                //대화로그가 없을 때
                if(data.length == 0){
                    console.log("나눈 대화가 없습니다."); 
                    
                            var template = `<!DOCTYPE html>
                                            <html>
                                                <head>
                                                    <meta charset="utf-8">
                                                    <script src="../../socket.io.js"></script>
                                                    <script src="../../vendor/jquery/jquery.min.js"></script>
                                                    <script src="../../vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
                                            
                                                    <!-- Plugin JavaScript -->
                                                    <script src="../../vendor/jquery-easing/jquery.easing.min.js"></script>
                                            
                                                    <!-- Contact form JavaScript -->
                                                    <script src="../../js/jqBootstrapValidation.js"></script>
                                                    <script src="../../js/contact_me.js"></script>
                                            
                                                    <!-- Custom scripts for this template -->
                                                    <script src="../../js/agency.min.js"></script>
                                            
                                                    <script>
                                                    var socket;
                                                        $(function(){
                                                          
                                                                var url = 'http://13.209.237.191:3000';
                                                                var options = {'forceNew' : true};
                                                                socket = io.connect(url,options);
                                                                socket.on('test',function(){
                                                                alert("test");
                                                                });
                                                           
                                            
                                                        $("#send").bind('click',function(event){
                                                                var message = $('#text_box').val();
                                                                var sender1 = "${sender}";
                                                                var guest1 = "${guest}";
                                                                var data = {sender : sender1, receiver : guest1, message : message}
                                                        
                                                                socket.emit('send_message',data);
                                                            });
                                                        });
                                                    </script>
                                                    <title>${guest}님과의 채팅방</title>
                                                    <style>
                                                        h1{
                                                            margin-top: -10px;
                                                            margin-bottom: 0;
                                                        }
                                                        #chat_display{
                                                            background-color: cadetblue;
                                                            height: 600px;
                                                        }
                                                        
                                                        .text_box{
                                                            width: 400px;
                                                        }
                                                    </style>
                                                
                                                </head>
                                                <body>
                                                    <h1 style="color:aliceblue; font-size:40px; background-color:darkslategray; text-align: center;">
                                                        ${guest}님과의 채팅방
                                                    </h1>
                                                    <div id="chat_display">
                                                       
                                                    </div>
                                                        <button id="send" value="">전송</button>
                                            
                                                        <input id="text_box" type="text" name="message">
                                                    <button id="test">ssss</button>
                                                    
                                                </body>
                                            </html>`
        
                                            res.send(template);
                }else{
                    //대화로그 페이지열며 출력
                    var messages =[];
                    
                    //"string" 형태로 변환해서 새 배열에 저장
                    for(var i=0;i<data.length;i++)
                        {
                            messages[i] = '"' + data[i]._doc.message + '"';
                            console.log(messages[i]);
                        }
                    
        
                    var template = `<!DOCTYPE html>
                                            <html>
                                                <head>
                                                    <meta charset="utf-8">
                                                    <script src="../../socket.io.js"></script>
                                                    <script src="../../vendor/jquery/jquery.min.js"></script>
                                                    <script src="../../vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
                                            
                                                    <!-- Plugin JavaScript -->
                                                    <script src="../../vendor/jquery-easing/jquery.easing.min.js"></script>
                                            
                                                    <!-- Contact form JavaScript -->
                                                    <script src="../../js/jqBootstrapValidation.js"></script>
                                                    <script src="../../js/contact_me.js"></script>
                                            
                                                    <!-- Custom scripts for this template -->
                                                    <script src="../../js/agency.min.js"></script>
                                            
                                                    <script>
                                                    var socket;
                                                        $(function(){
                                                          
                                                                var url = 'http://13.209.237.191:3000';
                                                                var options = {'forceNew' : true};
                                                                socket = io.connect(url,options);
                                                                socket.on('test',function(){
                                                                alert("test");
                                                                });
                                                           
                                            
                                                        $("#send").bind('click',function(event){
                                                                var message = $('#text_box').val();
                                                                var sender1 = "${sender}";
                                                                var guest1 = "${guest}";
                                                                var data = {sender : sender1, receiver : guest1, message : message}
                                                        
                                                                socket.emit('send_message',data);
                                                            });
                                                        });
                                                    </script>
                                                    <title>${guest}님과의 채팅방</title>
                                                    <style>
                                                        h1{
                                                            margin-top: -10px;
                                                            margin-bottom: 0;
                                                        }
                                                        #chat_display{
                                                            background-color: cadetblue;
                                                            height: 600px;
                                                        }
                                                        
                                                        .text_box{
                                                            width: 400px;
                                                        }
                                                    </style>
                                                
                                                </head>
                                                <body>
                                                    <h1 style="color:aliceblue; font-size:40px; background-color:darkslategray; text-align: center;">
                                                        ${guest}님과의 채팅방
                                                    </h1>
                                                    <div id="chat_display">
                                                       <script>
                                                            
                                                            var arr = [${messages}];
                                                            var i=0
                                                            while(i<${messages.length})
                                                            {
                                                                 document.write('<li>' + arr[i] + '</li>');
                                                                i++;
                                                            }
                                                        </script>
                                                    </div>
                                                        <button id="send" value="">전송</button>
                                                        
                                                        <input id="text_box" type="text" name="message">
                                                    <button id="test">ssss</button>
                                                    
                                                </body>
                                            </html>`
        
                                            res.send(template);
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