var crypto = require('crypto');

var Schema = {};

Schema.createSchema = function(mongoose){
    
    var UserSchema = mongoose.Schema({
    email : String,
    name : String,
    hashed_password : {type : String, 'default' : ' '},
    salt : {type : String},
    provider : {type : String, 'default' : ''},//mod
    authToken : {type : String, 'default' : ''},//mod
    facebook : {}//mod
  });
    
    UserSchema.virtual('password').set(function(password){
      this._password = password;
      this.salt = this.makeSalt();
      this.hashed_password = this.encryptPassword(password);
      console.log('virtual_method 호출 : ' + this.hashed_password);
    });
    
    UserSchema.static('findById', function(id, callback) {
		return this.find({id:id}, callback);
	});
    
    UserSchema.method('encryptPassword',function(plainText, inSalt){
      if(inSalt){
          return crypto.createHmac('sha1',inSalt).update(plainText).digest('hex');
      }else{
          return crypto.createHmac('sha1',this.salt).update(plainText).digest('hex');
      }
    });
    
    UserSchema.method('makeSalt', function(){
      return Math.round((new Date().valueOf()* Math.random()));
    });
    
    UserSchema.method('authenticate', function(plainText, inSalt, hashed_password) {
		if (inSalt) {
			console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText, inSalt), hashed_password);
			return this.encryptPassword(plainText, inSalt) === hashed_password;
		} else {
			console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText), this.hashed_password);
			return this.encryptPassword(plainText) === this.hashed_password;
		}
	});
        
   console.log('UserSchema 정의함');
    
    return UserSchema;
}

module.exports = Schema;