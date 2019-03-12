var Schema = {};

Schema.createSchema = function(mongoose){
    var chat_status_Schema = mongoose.Schema({
        user : {type : String},
        contact_person : {type : String}
    });
    
    return chat_status_Schema;
}

module.exports = Schema;