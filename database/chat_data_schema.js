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