//사실상 사용안한다고 볼수 있지
var crypto = require('crypto');

var Schema = {};

Schema.createSchema = function(mongoose){
    
    var Chat_dataSchema = mongoose.Schema({
        name : {type : String},
        date : {type : Date}
    });
    
    return Chat_dataSchema;
}

module.exports = Schema;