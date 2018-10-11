var crypto = require('crypto');

var Schema = {};

Schema.createSchema = function(mongoose){
    
    var ChatSchema = mongoose.Schema({
        host : {type : String, 'default' : ''},
        contact_person : {type : String, 'default' : ''},
        text : {type : String, 'default' : ''}
    });
    
    return ChatSchema;
}

module.exports = Schema;