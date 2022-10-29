var phoneList = require("../models/phoneList");
var userList = require("../models/userList");
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var $ = require("jquery");
const session = require("express-session");
const { status } = require("express/lib/response");

/*****************There are few examples of controller methods *************************** */
// module.exports.showTitleForm = function(req,res){
// 	res.render("titleForm.pug")
// }
/*****************There are few examples of controller methods *************************** */
// module.exports.getLatest = function(req,res){
// 	title = req.query.title;
//     console.log(title);

// 	Revision.findTitleLatestRev(title, function(err,result){
// 		if (err){
// 			console.log("Cannot find " + title + ",s latest revision!")
// 		}else{
// 			// console.log(result)
// 			revision = result[0];
// 			console.log(revision);
// 			res.render('revision.pug',{title: title, revision:revision})
// 		}	
// 	})	
// }

const transporter = nodemailer.createTransport({
	service: 'qq',
	port: 465,
	secureConnection: true,
	auth: {
		user: process.env.EMAIL_USERNAME,
		pass: process.env.EMAIL_PASSWORD,
	}
});

module.exports.showMainPage = function(req, res) {
	let soldOutPhoneList;
	let bestSellerPhoneList;
	sess = req.session;
	console.log(req.session.id);

	let ifLogin = 0;
	if(sess&& "userId" in sess) {
		console.log("已经登录");
		ifLogin = 1;
	}else{
		console.log("没有userId,没有登录");
	}

	console.log(req.params);
	console.log(req.params.status);
	if(req.params.status == null) {
		if ( sess && "previousPageUrl" in sess) {
			console.log("发现sess有previousPageUrl值:" + sess.previousPageUrl);
			sess.previousPageUrl = "http://localhost:3000"+req.originalUrl;
			console.log("更新为:" + sess.previousPageUrl);
			
		} else {
			console.log("发现sess previousPageUrl没值或者sess失败");
			sess.previousPageUrl = "http://localhost:3000"+req.originalUrl;
			console.log("更新为:" + sess.previousPageUrl);
		}
	}

	phoneList.findSoldOutSoonPhone(function(err,result){
		if (err){
			console.log("findSoldOutSoonPhone something wrong!")
		}else{
		  
		 // console.log(result);
		  console.log("findSoldOutSoonPhone ok!")
		  console.log(result.length);
		  soldOutPhoneList = result;
		  phoneList.findPopularPhone(function(err,result) {
			if(err) {
			  console.log("findPopularPhone something wrong!")
			}else{
			//   console.log(result);
			  console.log("findPopularPhone something ok!")
			  console.log(result.length);
			  bestSellerPhoneList = result;

			  phoneList.aggregatePhoneBrand(function (err, result) {
				if(err){
					console.log("aggregatePhoneBrand get wrong!");
				}else{
					brandDate = result;
					console.log("aggregatePhoneBrand ok!")
					console.log(result.length);
					res.render("mainPage.ejs",{soldOutPhoneList:soldOutPhoneList, bestSellerPhoneList:bestSellerPhoneList, brandDate:brandDate, ifLogin:ifLogin});
				}
			  })
			  //res.render("mainPage.ejs",{soldOutPhoneList:soldOutPhoneList, bestSellerPhoneList:bestSellerPhoneList});
			}
		  })
		}	
	})	
}
 
module.exports.logout = function(req, res) {
	console.log("生成New session !!!!!");
	req.session.regenerate(function(err) {
		if(err){
			
			console.log("New session error");
		}else {
			console.log("New session success:"+req.session.id);
			//res.redirect(301, 'http://localhost:3000/');
			res.redirect('http://localhost:3000/');
		}
		
	});


	
}

module.exports.showSearchResults = function(req, res) {
	partOfTitle = req.query.partOfTitle;
	console.log(partOfTitle);
	phoneList.findPhoneByTitle(partOfTitle,function(err,result){
		if(err){
			console.log("findPhoneByTitle wrong!");
		}else{
			searchResult = result;
			//console.log(result);
			console.log(result.length);
			console.log("findPhoneByTitle ok!")
			res.render("searchState.ejs",{searchResult:searchResult});
		}
	})
}

module.exports.showSearchResultsByfilter = function(req, res) {
	partOfTitle = req.query.partOfTitle;
	brand = req.query.brand;
	price = req.query.price;

	console.log(partOfTitle);
	console.log(brand);
	console.log(price);

	phoneList.findPhoneByFilter(partOfTitle, brand, price, function(err,result){
		if(err) {
			console.log("findPhoneByFilter wrong!");
		}else {  
			searchResult = result;
			//console.log(result);
			console.log(result.length);
			console.log("findPhoneByFilter ok!")
			res.render("searchState.ejs",{searchResult:searchResult});
		}
	})

}

module.exports.showPhoneByBrand = function(req, res) {
	partOfTitle = req.query.partOfTitle;
	brand = req.query.brand;

	phoneList.findPhoneByBrand(partOfTitle,  brand, function(err, result){
		if(err) {
			console.log("findPhoneByBrand wrong!");
		}else{
			searchResult = result;
			console.log(result.length);
			console.log("findPhoneByBrand ok!");
			res.render("searchState.ejs",{searchResult:searchResult});
		}
	})
}
module.exports.showPhoneDetails = function(req, res) {
	phone_Id = req.query.phoneID;
	console.log("phone_Id:" + phone_Id);
	//console.log("http://localhost:3000"+req.originalUrl);
    // get session
    sess = req.session;
	//console.log(req.session);

	if ( sess && "previousPageUrl" in sess) {
		console.log("发现sess有值" + sess.previousPageUrl);
		sess.previousPageUrl = "http://localhost:3000"+req.originalUrl;
		console.log("发现sess有值更新为:" + sess.previousPageUrl);	
	} else {
		
		sess.previousPageUrl = "http://localhost:3000"+req.originalUrl;
		console.log("发现sess没值或者sess失败更新为:" + sess.previousPageUrl);
	}

	phoneList.findOnePhoneById(phone_Id, function (err, result) {
		if(err) {
			console.log("findOnePhoneByTitle wrong!");
		}else{
			searchResult = result;
			console.log(result);
			console.log("findOnePhoneByTitle ok!");
			let numberInCart = 0;
			if ( "userId" in sess) {
				cartRecordingMap = req.app.locals.cartRecordingMap;
				email = sess.userId;
				userList.checkEmailExist(email, function(err, result){
					if(err){
						console.log("查询用户id失败");
					}else{
						console.log("查询用户id成功");
						user_id = result[0]._id.toString();
						phoneId = searchResult[0]._id.toString();
						if( cartRecordingMap.has(user_id) ) {
							if(cartRecordingMap.get(user_id).has(phoneId)) {
								console.log("找到该用户该手机历史购物车记录");
								numberInCart = cartRecordingMap.get(user_id ).get(phoneId)[1];
								console.log("历史记录为:"+ numberInCart);
								res.render("item.ejs", {searchResult:searchResult, numberInCart: numberInCart.toString()});
							}else{
								res.render("item.ejs", {searchResult:searchResult, numberInCart: numberInCart.toString()});
							}
							

						}else{
							res.render("item.ejs", {searchResult:searchResult, numberInCart: numberInCart.toString()});
						}
						
					}
				})
			}else{
				res.render("item.ejs", {searchResult:searchResult, numberInCart: numberInCart.toString()});
			}
			
			
		}
	})
	
}

module.exports.myAddCart = function(req, res) {
	console.log("控制器myAddCart");
	title = req.body.title;
	value = req.body.value;
	phoneId = req.body.phoneId;
	brand = req.body.brand;
	price = req.body.price;
	let user_id;
	console.log(title);
	console.log(value);
	console.log(phoneId);
	console.log(brand);
	console.log(price);
	sess = req.session;
	if(sess && "userId" in sess){
		console.log("已经登录");
		cartRecordingMap = req.app.locals.cartRecordingMap;
	
		email = sess.userId;
		userList.checkEmailExist(email, function(err, result){
			if(err) {
				console.log("checkEmailExist wrong!");
			}else{
				//  userId  VALUE:[[phone1 title, phone1 quantity, phone1 id],[phone2 title, phone2 quantity, phone2 id],.....]
				user_id = result[0]._id.toString();
				console.log("控制器myAddCart的user_id:" + user_id);
				// let array = [];
				// array.push(title);
				// array.push(value);
				// array.push(phoneId);
				let onePhoneDetail = [];
				onePhoneDetail.push(title);
				onePhoneDetail.push(value);
				onePhoneDetail.push(brand);
				onePhoneDetail.push(price);
				let oneRecrodMap = new Map();
				oneRecrodMap.set(phoneId,onePhoneDetail);
				if(cartRecordingMap.has(user_id)) {
					console.log("该用户在购物车里有记录");
					
					if(cartRecordingMap.get(user_id).has(phoneId)){
						console.log("该用户在购物车里该手机有记录");
						tmpOnePhoneDetailArray = cartRecordingMap.get(user_id).get(phoneId);//获取该手机记录
						tmpOnePhoneDetailArray[1] = parseInt(value);//更新该手机的记录
						cartRecordingMap.get(user_id).set(phoneId, tmpOnePhoneDetailArray);
						console.log(cartRecordingMap);
					}else{
						console.log("该用户在购物车里没有该手机有记录");
						cartRecordingMap.get(user_id).set(phoneId, onePhoneDetail);
						console.log(cartRecordingMap);
					}
					// getArray = cartRecordingMap.get(user_id);
					// getArray[1] = parseInt(cartRecordingMap.get(user_id)[1]) + parseInt(value)
					// cartRecordingMap.set( user_id, getArray );
				}else{
					 console.log("该用户在购物车里没有记录");
					// cartRecordingMap.set( user_id, array);
					// console.log(cartRecordingMap.get(user_id));
					// console.log(cartRecordingMap);
					cartRecordingMap.set(user_id, oneRecrodMap);
					console.log(cartRecordingMap);
				}
				res.send(cartRecordingMap.get(user_id).get(phoneId)[1].toString());
				
				
			}
		})

		// if(cartRecordingMap.has(fieldName)) {
		// 	console.log("购物车里有");
		// 	cartRecordingMap.set( fieldName, parseInt(cartRecordingMap.get(fieldName))+ parseInt(value) );
		// }else{
		// 	console.log("购物车里没有");
		// 	cartRecordingMap.set(fieldName, parseInt(value)); 
		// }
		
	}else {
		console.log("没有登录,前往登录");
		res.send("");

	}

}

module.exports.addOneComment = function(req, res) {
	rating = req.params.rating;
	comment = req.params.comment;
	phoneId = req.params.phoneId;
	let user_id ;
	console.log(rating);
	console.log(comment);
	console.log(phoneId);
	sess = req.session;

	if(sess && "userId" in sess){
		console.log("已经登录");
		email = sess.userId;
		backURL = sess.previousPageUrl;
		userList.checkEmailExist(email, function(err, result){
			if(err) {
				console.log("checkEmailExist wrong!");
			}else{
				user_id = result[0]._id;
				console.log("控制器addOneComment的user_id:" + user_id);
				phoneList.addOneComment(phoneId, user_id, rating, comment, function(err, result) {
					if(err){
						console.log("addOneComment wrong!");
					}else{
						console.log(result);
						console.log("addOneComment ok!");
						//backURL = backURL + "/1";
						res.redirect(301,backURL);
						
					}
				})
			}
		})
		//phoneSchema.statics.addOneComment = function(phoneTitle, userID, rating, comment, callback)
		

	
	}else {
		console.log("没有登录,前往登录");
		//res.redirect(301,'http://localhost:3000/login');
		res.render("loginPage.ejs", {prompt: false, email:"", userPrompt: false});


	}
}


module.exports.showLoginPage=function(req,res){
	console.log("进入showLoginPage");
	console.log("进入showLoginPage");
	console.log("进入showLoginPage");
	console.log("进入showLoginPage");
	res.render("loginPage.ejs", {prompt: false, email: "", userPrompt: false});
}

module.exports.login=function(req,res){
	var email = req.body.email;
	var password = req.body.password;
	var hashedPw = crypto.createHash('md5').update(password).digest('hex');
	var sess = req.session;

	if ("Reset" in req.body) {
		res.render("forgotPwPage.ejs");
		return;
	}
	
	userList.checkEmailExist(email, function(err,result){
		if (err){
			console.log("checkEmailExist login error!");
		}else{
			console.log(result)
			if (result.length == 0) {
				res.render("loginPage.ejs", {prompt: false, email: "", userPrompt: true});
			} else {
				if (hashedPw == result[0].password) {
					if (sess&& "previousPageUrl" in sess) {
						console.log("发现sess有值")
						console.log(sess.previousPageUrl);
						sess.userId = email;
						res.redirect(sess.previousPageUrl);
					} else {
						console.log("发现sess没值或者sess失败");
						console.log(sess.previousPageUrl);
						console.log("一般不会出现,login后用户没有加入sess才会出现!");
						res.render("resetPw.ejs");
					}
					
				} else {
					res.render("loginPage.ejs", {prompt: true, email: email, userPrompt: false});
				}
			}
		}	
	})
}

module.exports.showSignUpPage=function(req,res){
	res.render("signUpPage.ejs", {prompt: false});
}

module.exports.signUp=function(req,res){
	var email = req.body.email;

	userList.checkEmailExist(email, function(err,result){
		if (err){
			console.log("checkEmailExist signup error!");
		} else{
			if (result.length > 0) {

				res.render("signUpPage.ejs", {prompt: true});

			} else {
				var firstName = req.body.firstName;
				var lastName = req.body.lastName;
				var password = req.body.password;
				var hashedPw = crypto.createHash('md5').update(password).digest('hex');
				

				var url = `http://localhost:3000/verify/${firstName}/${lastName}/${email}/${hashedPw}`;
				// var myParams = {firstName: firstName, lastName: lastName, email: email, hashedPw: hashedPw};
				// var url = "http://localhost:3000/verify" + $.param(myParams);
				var mailOptions = {
					from: process.env.EMAIL_USERNAME,
					to: email,
					subject: 'Verify Account',
					html: `Click <a href = '${url}'>here</a> to confirm your email.`
				};

				transporter.sendMail(mailOptions, function(error, info){
					if (error) {
					  console.log(error);
					} else {
					  console.log('Email sent: ' + info.response);
					}
				});
				res.render("emailSent.ejs");
			}
		}	
	})
	
}

module.exports.showResetPage=function(req,res){
	res.render("resetPw.ejs");
}

module.exports.createAccount=function(req,res){
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var email = req.body.email;
	var password = req.body.hashedPw;
		
	userList.create({ firstname: firstName, lastname: lastName, email: email, password: password},function (err) {
		if (err) return handleError(err);
		console.log("saved");
		// saved!
	});

	res.render("loginPage.ejs", {prompt: false, email: email, userPrompt: false});
}

module.exports.showEmailVerificationPage=function(req,res){
	res.render("emailVerification.ejs");
}

module.exports.sendResetVerifyEmail=function(req,res){
	var email = req.body.email;
	var url = `http://localhost:3000/reset/${email}`;

	var mailOptions = {
		from: process.env.EMAIL_USERNAME,
		to: email,
		subject: 'Reset Password',
		html: `Click <a href = '${url}'>here</a> to confirm your email.`
	};

	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
		  console.log(error);
		} else {
		  console.log('Email sent: ' + info.response);
		}
	});

	res.render("emailSent.ejs");
}

module.exports.resetPassword=function(req,res){
	var email = req.body.email;
	var query = { email: email };
	var password = req.body.password;
	var resetPw = crypto.createHash('md5').update(password).digest('hex');
	userList.findOneAndUpdate(query, { $set: { password: resetPw }}, function (err) {
		if (err) return handleError(err);
		console.log("reset sucessfully");
		// saved!
	});
	res.render("loginPage.ejs", {prompt: false, email: email, userPrompt: false});
}

module.exports.showForgotPwPage=function(req,res){
	res.render("forgotPwPage.ejs");
}

module.exports.showSentPage=function(req,res){
	res.render("emailSent.ejs");
}

module.exports.showCheckOutPage=function(req,res){
	cartRecordingMap = req.app.locals.cartRecordingMap;
	if (sess&& "userId" in sess) {
		console.log("发现sess有值")
		console.log(sess.userId);
		var email = sess.userId;
		userList.checkEmailExist(email, function(err, result){
			if(err){
				console.log("查询id失败");
			}else{
				console.log("查询id成功");
				user_id = result[0]._id.toString();
				if( cartRecordingMap.has(user_id) ) {
					console.log("找到历史购物车记录");
					console.log(cartRecordingMap.get(user_id));
					var itemList = [];
					for (var [key, value] of cartRecordingMap.get(user_id)) {
						itemList.push(value);
					}
					console.log(itemList);
					
					res.render("checkOutPage.ejs", {itemsInCart : itemList});
				} else {
					res.render("checkOutPage.ejs", {itemsInCart : []});
				}
			}
		})
		
	} else {
		console.log("发现sess没值或者sess失败");
		console.log(sess.previousPageUrl);
		res.render("loginPage.ejs", {prompt: false, email: "", userPrompt: false});
	}
	
}

module.exports.checkStock=function(req,res){
	var itemTitle = req.query.itemTitle;

	phoneList.getPhoneByTitle(itemTitle,function(err,result){
		if(err){
			console.log("getPhoneByTitle wrong!");
		}else{
			console.log("getPhoneByTitle correct!");
			res.send(result[0].stock.toString());
		}
	})
}

module.exports.checkoutBack=function(req,res){
	var sess = req.session;
	if (sess&& "previousPageUrl" in sess) {
		console.log("发现sess有值")
		console.log(sess.previousPageUrl);
		res.redirect(sess.previousPageUrl);
	} else {
		console.log("发现sess没值或者sess失败");
		console.log(sess.previousPageUrl);
		res.render("resetPw.ejs");
	}
}

module.exports.checkout=function(req,res){
	
	var itemTitleList = req.body.title;
	var amountList = req.body.amount;


	if (itemTitleList instanceof Array == false) {
		var query = {title : itemTitleList};
		phoneList.findOneAndUpdate(query, { "$inc": { "stock": - parseInt(amountList)} }, function (err, obj) {
			if (err) {
				console.log("update fail");
			} else {
				console.log("update stock sucessfully");
			}
			
		});
		removeFromCartRecordingMap (itemTitleList, amountList, req);
		res.render("itemPaid.ejs");

	} else {
		for (var i = 0; i < itemTitleList.length;i++) {
			var query = {title : itemTitleList[i]};
		
			phoneList.findOneAndUpdate(query, { "$inc": { "stock": - parseInt(amountList[i])} }, function (err, obj) {
				if (err) {
					console.log("update fail");
				} else {
					console.log("update stock sucessfully");
					
				}
			});

			removeFromCartRecordingMap (itemTitleList[i], amountList[i], req);
		}
		res.render("itemPaid.ejs");
	}

}

module.exports.removeItem=function(req,res) {
	itemTitle = req.query.itemTitle;
	removeFromCartRecordingMap(itemTitle, 0, req);
	console.log(req.app.locals.cartRecordingMap);
	res.send("remove sucessfully");
}

function removeFromCartRecordingMap (itemTitle, amount, req) {
	cartRecordingMap = req.app.locals.cartRecordingMap;
	if ( sess&& "userId" in sess) {
		console.log("发现sess有值")
		console.log(sess.userId);
		var email = sess.userId;
		userList.getUserByEmail(email, function(err, result){
			if(err) {
				console.log("getUserByEmail wrong!");
			}else{
				user_id = result[0]._id.toString();
				if( cartRecordingMap.has(user_id) ) {
					console.log("removing!!!")
					console.log(cartRecordingMap.get(user_id));
					console.log(amount);
					
					
					for (var [key, value] of cartRecordingMap.get(user_id)) {
						if (value[0] == itemTitle) {
							var itemId = key;
							var newAmount = value[1] - amount;
							var tempValue = value;
							tempValue[1] = newAmount;
						}
					}

					if (amount == 0) {
						cartRecordingMap.get(user_id).delete(itemId);
					} else {
						if (newAmount > 0) {
							cartRecordingMap.get(user_id).set(itemId, tempValue.toString());
						} else {
							cartRecordingMap.get(user_id).delete(itemId);
						}
					}
					
					
					console.log("cartRecordingMap remove item sucessfully");
					
					
				} else {
					console.log("cartRecordingMap dont have (user_id)");
				}
			}
		});
		
	} else {

		console.log("发现sess没值或者sess失败");
	}
}

// Liao qi code here
module.exports.showUserPage = function(req, res){
	console.log("showUserPage");
	console.log("showUserPage");
	let status;
	//console.log(req.params);
	if(req.params.status != null){
		status = req.params.status;
		console.log(status);
	}
	
	var sess = req.session;
	if( sess&& "userId" in sess){
		console.log("用户已经登录");
		email = sess.userId;
		userList.checkEmailExist(email, function(err, result) {
			if(err){
				console.log("checkEmailExist error");
			}else{
				console.log("checkEmailExist ok");
				userAllDetails = result;
				console.log(userAllDetails);

				userId = result[0]._id;
				phoneList.findPhoneBySeller(userId, function(err, result) {
					if(err){
						console.log("findPhoneBySeller error");
					}else{
						console.log("findPhoneBySeller ok");
						//console.log(result);
						myPhoneList = result;
						res.render("userpage.ejs",{userAllDetails:userAllDetails, myPhoneList:myPhoneList, status:status});
					}
				});
				
			}
		})
	}else{
		console.log("用户没登录，前往登录");
		sess.previousPageUrl = "http://localhost:3000"+req.originalUrl;
		console.log("更新为:" + sess.previousPageUrl);
		res.redirect(301,'http://localhost:3000/login');
	}

	
}

module.exports.confirmPassword = function(req, res) {
	password = req.body.password;
	var hashedPw = crypto.createHash('md5').update(password).digest('hex');
	res.send(hashedPw);
}
module.exports.updateProfile = function(req, res) {
	
	firstname = req.query.firstname;
	lastname = req.query.lastname;
	email = req.query.email;
	userId = req.query.userId;
	console.log(firstname);
	console.log(lastname);
	console.log(email);
	console.log(userId);

	//userSchema.statics.Editprofile = function(userId, firstname,lastname,email, callback)
	userList.Editprofile(userId,firstname,lastname,email, function(err, result){
		if(err){
			console.log("Editprofile error");
		}else{
			console.log("Editprofile ok");
			console.log(result);
			res.send("1");
			//res.redirect(301,'http://localhost:3000/showUserPage');
		}
	}) 

}

module.exports.updatePassword = function(req, res){
	newPassword = req.body.newPassword;
	console.log(newPassword);
	var hashedPw = crypto.createHash('md5').update(newPassword).digest('hex');
	var sess = req.session;
	if("userId" in sess){
		//userSchema.statics.updatePassword = function(email, newPassword, callback)
		email = sess.userId;
		userList.updatePassword(email,hashedPw,function(err, result){
			if(err){
				console.log("updatePassword error");
				res.send("0");
			}else{
				console.log("updatePassword ok");
				console.log(result);
				res.send("1");
			}
		})
	}
}
module.exports.addOnePhone  = function (req, res) { 
	brand = req.query.brand;
	title = req.query.title;
	stock = req.query.stock;
	price =  req.query.price;
	disabled = req.query.disabled;
	seller = req.query.seller;
	image = "imageurl";
	console.log(brand);
	console.log(title);
	console.log(stock);
	console.log(price);
	console.log(disabled);
	console.log(seller);

	if(disabled == "false"){
		phoneList.create({title:title, brand:brand, image:image, stock:stock, seller:seller, price:price},function(err, result){
			if(err){
				console.log("addOnePhoneNoDisabled error");
			}else{
				console.log("addOnePhoneNoDisabled ok");
				console.log(result);
				res.send("1");

	
			}
		})
	}else{
		phoneList.create({title:title, brand:brand, image:image, stock:stock, seller:seller, price:price, disabled:""},function(err, result){
			if(err){
				console.log("addOnePhonehasDisabled error");
			}else{
				console.log("addOnePhonehasDisabled ok");
				console.log(result);
				res.send("1");
			}
		})
	}
}
	module.exports.deleteOnePhone = function(req, res){
		phoneId = req.query.phoneID;

		console.log(phoneId);
		console.log("进入deleteOnePhone");
			phoneList.deletePhoneById(phoneId,function(err, result){
				if(err){
					console.log("deletePhone error");
					res.send("0");
				}else{
					console.log("deletePhone ok");
					console.log(result);
					res.send("1");
				}
			});
	
 }
 //disabledOnePhone
 module.exports.disabledOnePhone = function(req, res){
	phoneId = req.query.phoneID;
	console.log(phoneId);
	console.log("进入disabledOnePhone");
		phoneList.disabledPhoneById(phoneId,function(err, result){
			if(err){
				console.log("disabledPhone error");
				res.send("0");
			}else{
				console.log("disabledPhone ok");
				console.log(result);
				res.send("1");
			}
		});

}

module.exports.enabledOnePhone = function(req, res){
	phoneId = req.query.phoneID;
	console.log(phoneId);
	console.log("进入enabledOnePhone");
		phoneList.enabledPhoneById(phoneId,function(err, result){
			if(err){
				console.log("enabledPhone error");
				res.send("0");
			}else{
				console.log("enabledPhone ok");
				console.log(result);
				res.send("1");
			}
		});

}
// module.exports.checkout=function(req,res){
// 	console.log(req.body);
// 	var itemTitleList = req.body.title;
// 	var amountList = req.body.amount;
// 	var newStock = 0;

// 	if (itemTitleList instanceof Array == false) {
// 		phoneList.getPhoneByTitle(itemTitleList,function(err,result){
// 			if(err){
// 				console.log("getPhoneByTitle wrong!");
// 			}else{
// 				console.log("getPhoneByTitle correct!");
// 				console.log(result);
// 				newStock = parseInt(result[0].stock) - parseInt(amountList);
				
// 				var query = { title : itemTitleList };
	
// 				phoneList.findOneAndUpdate(query, { $set: { stock : newStock }}, function (err) {
// 					if (err) return handleError(err);
// 					console.log("update stock sucessfully");

// 					// saved!
// 				});
// 			}
// 		})

// 		// var query = { title : itemTitleList };
// 		// console.log(`update ${newStock}`);
// 		// phoneList.findOneAndUpdate(query, { $set: { stock : newStock }}, function (err) {
// 		// 	if (err) return handleError(err);
// 		// 	console.log("update stock sucessfully");

// 		// 	// saved!
// 		// });
// 	} else {
// 		for (var i = 0; i < itemTitleList.length; i++) {
// 			phoneList.getPhoneByTitle(itemTitleList[i],function(err,result){
// 				if(err){
// 					console.log("getPhoneByTitle wrong!");
// 				}else{
// 					console.log("getPhoneByTitle correct!");
					
// 					newStock = parseInt(result[0].stock) - parseInt(amountList[i]);
					
// 				}
// 			})	

// 			var query = { title : itemTitleList[i] };
// 			phoneList.findOneAndUpdate(query, { $set: { stock : newStock }}, function (err) {
// 				if (err) return handleError(err);
// 				console.log("update stock sucessfully");

// 				// saved!
// 			});
// 		}
// 	}
	
// }
