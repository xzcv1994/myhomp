var crypto = require('crypto');

var Schema = {};

Schema.createSchema = function(mongoose){
    
    var Chat_numSchema = mongoose.Schema({
        num : {type : Number, 'default' : 0}
    });
    
    return Chat_numSchema;
}

module.exports = Schema;