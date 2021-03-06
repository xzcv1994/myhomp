var Schema = {};

Schema.createSchema = function(mongoose){
    
    var message_Schema = mongoose.Schema({
        sender : {type : String, required : true},
        receiver : {type : String, required : true},
        message : {type : String, required : true, default : ' '},
        create_date : {type : Date, default : new Date()}
    })
    
    return message_Schema;
}

module.exports = Schema;