var mongoose = require('./db');

var userSchema = new mongoose.Schema({
	
	firstname: String, 
	lastname: String,
	email: String,
	password: String
},{
	versionKey: false 
});

userSchema.statics.findOneUser = function(userId, callback) {
	return this.find( {'_id': userId}).exec(callback)
}

userSchema.statics.checkEmailExist = function(email, callback) {
	return this.find({'email':email})
	.exec(callback)
}

userSchema.statics.getUserByEmail = function(email, callback) {
	return this.find( {'email': email}).exec(callback)
}
userSchema.statics.Editprofile = function(userId, firstname,lastname,email, callback) {
	return this.update( {'_id': userId},{$set:{'firstname':firstname,'lastname':lastname,'email':email}}).exec(callback)
}
userSchema.statics.updatePassword = function(email, hashedPw, callback) {
	return this.update( {'email':email},{$set:{'password':hashedPw}}).exec(callback)
}



// userSchema.statics.addNewClient = function(firstName, lastName, email, hashedPw, callback) {
// 	var newClient = new UserList(
// 		{ 
// 			firstname: firstName, 
// 			lastname: lastName,
// 			email: email,
// 			password: hashedPw
// 		})
// 	newClient.save(callback)
// }

var UserList = mongoose.model('UserList', userSchema, 'userlist');
module.exports = UserList;