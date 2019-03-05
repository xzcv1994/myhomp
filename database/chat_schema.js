//채팅방에 대한 정보
var crypto = require('crypto');

var Schema = {};

Schema.createSchema = function(mongoose){
    
    var Chat_Schema = mongoose.Schema({
        host : {type : String, 'default' : ''},
        contact_person : {type : String, 'default' : ''}
    });
    
    return Chat_Schema;
}

module.exports = Schema;