var mongoose = require('mongoose');
var database = {};

database.init = function(app,config){
    connect(app,config);
}

function connect(app,config){
    console.log('connect() 호출');
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db_url,{ useNewUrlParser: true });
    database.db = mongoose.connection;
    
    database.db.on('error', console.error.bind(console, 'mongoose connection error'));
    
    database.db.on('open',function(){
        console.log("success to connect");
        
        createSchema(app,config);
    });
    database.db.on('disconnected',connect);
}

function createSchema(app,config){
    
    //user_schema  
    var curSchema  = require(config.db_schemas[0].file).createSchema(mongoose);
    
    var curModel = mongoose.model(config.db_schemas[0].collection,curSchema);
    
    database[config.db_schemas[0].schemaName] = curSchema;
    database[config.db_schemas[0].modelName] = curModel;
    
    //chat_schema
    var curSchema2  = require(config.db_schemas[1].file).createSchema(mongoose);
    
    var curModel2 = mongoose.model(config.db_schemas[1].collection,curSchema2);
    
    database[config.db_schemas[1].schemaName] = curSchema2;
    database[config.db_schemas[1].modelName] = curModel2;
    
    //chat_num_schema
    var curSchema3  = require(config.db_schemas[2].file).createSchema(mongoose);
    
    var curModel3 = mongoose.model(config.db_schemas[2].collection,curSchema3);
    
    database[config.db_schemas[2].schemaName] = curSchema3;
    database[config.db_schemas[2].modelName] = curModel3;
        
    //message_schema
    var curSchema4  = require(config.db_schemas[3].file).createSchema(mongoose);
    
    var curModel4 = mongoose.model(config.db_schemas[3].collection,curSchema4);
    
    database[config.db_schemas[3].schemaName] = curSchema4;
    database[config.db_schemas[3].modelName] = curModel4;
    
    
    app.set('database',database);
    console.log('database 객체가 app 객체의 속성으로 추가됨');
}

module.exports = database;