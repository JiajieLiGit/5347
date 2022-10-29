// /**
//  * 
//  */
// var mongoose = require('./db')

// var RevisionSchema = new mongoose.Schema({
// 	itle: String, 
// 	timestamp:String,
// 	user:String,
// 	anon:String
// },{
// 	versionKey: false
// });

// RevisionSchema.statics.findTitleLatestRev = function(title, callback){
// 	return this.find({'title':title})
// 	.sort({'timestamp':-1})
// 	.limit(1)
// 	.exec(callback)
// }

// var Revision = mongoose.model('Revision', RevisionSchema, 'revisions')

// module.exports = Revision
var mongoose = require('./db');

var oneReviews = new mongoose.Schema({
		reviewer: {type: String, ref: 'UserList'},
		rating: Number,
		comment: String
	},{ _id : false });



var phoneSchema = new mongoose.Schema({
	title: String, 
	brand: String,
	image: String,
	stock: Number,
	seller: {type: mongoose.Schema.Types.ObjectId, ref: 'UserList'},
	price: Number,
	disabled: String,
	reviews: [
		
		oneReviews
		
	]
},{
	versionKey: false 
});

phoneSchema.statics.findSoldOutSoonPhone = function(callback) {
	return this.find(
		{
			stock:{$gt:0},
			disabled:{$exists:false}
		}
	)
	.sort({stock:1})
	.limit(5)
	.exec(callback);
}

phoneSchema.statics.findPopularPhone = function(callback) {
	return this.aggregate([
		{
			$match: {
				disabled: {$exists:false},
				"reviews.1": {$exists: true}
			}
			
		},
		{
			$addFields: {
				avgRate: {$avg: "$reviews.rating"}
			}
		},
		{
			$sort: {avgRate:-1}
		},
		{
			$limit: 5
		}
	]).exec(callback);
}

phoneSchema.statics.findPhoneByTitle = function(partOfTitlt, callback) {
	return this.find(
		{
			title: {$regex: new RegExp(partOfTitlt.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'),"i")},
			stock:{$gt:0},
			disabled:{$exists:false}
		}
	).exec(callback)
}

phoneSchema.statics.findPhoneByFilter = function(partOfTitle, brand, price, callback) {
	
	if(brand) {
		return this.find(
			{
				title: {$regex: new RegExp(partOfTitle,"i")},
				price: {$lt: price },
				brand: brand
			}
		).exec(callback)
	}else {
		return this.find(
			{
				title: {$regex: new RegExp(partOfTitle,"i")},
				price: {$lt: price }
			}
		).exec(callback)
	}

}

phoneSchema.statics.findPhoneByBrand = function(partOfTitle, brand, callback) {
	return this.find(
		{
			title: {$regex: new RegExp(partOfTitle,"i")},
			brand: brand
		}
	).exec(callback)
}

phoneSchema.statics.findOnePhoneById = function(phone_Id, callback){
	return this.find(
		{
			_id:phone_Id
		}
	).populate('seller', 'firstname lastname').populate('reviews.reviewer', 'firstname lastname').exec(callback)
}

phoneSchema.statics.getPhoneByTitle = function(title, callback){
	return this.find(
		{
			title:title
		}
	).exec(callback)
}


phoneSchema.statics.aggregatePhoneBrand = function(callback) {
	return this.aggregate( [
		{
			$group: {
				_id: "$brand",
				sum: {$sum: 1}
			}
		}

	]).exec(callback);
}

phoneSchema.statics.addOneComment = function(phoneId, user_id, rating, comment, callback) {
	console.log("tmd userIdshib: " + user_id);
	return this.updateOne(
		{_id:phoneId},
		{
			$push:{
				reviews: {reviewer:user_id, rating:rating, comment:comment }
			}
				
		}
	).exec(callback)
}

phoneSchema.statics.findPhoneBySeller = function(userId, callback) {
	return this.find({'seller':userId}).exec(callback);
}
phoneSchema.statics.deletePhoneById = function(phoneId, callback) {
	return this.remove({_id:phoneId}).exec(callback);
}
phoneSchema.statics.disabledPhoneById = function(phoneId, callback) {
	return this.update({_id:phoneId},{$set:{disabled:""}}).exec(callback);
}
phoneSchema.statics.enabledPhoneById = function(phoneId, callback) {
	return this.update({_id:phoneId},{$unset:{disabled:""}}).exec(callback);
}


var PhoneList = mongoose.model('PhoneList', phoneSchema, 'phonelisting');
module.exports = PhoneList;

