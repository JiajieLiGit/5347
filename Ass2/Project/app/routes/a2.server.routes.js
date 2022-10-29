var express = require('express');
var controller = require('../controllers/a2.server.controller');
var router = express.Router();

router.get('/', controller.showMainPage);
router.get('/renderTop/:status', controller.showMainPage);
router.get('/search', controller.showSearchResults);
router.get('/search/byFilter', controller.showSearchResultsByfilter);
router.get('/search/byBrand', controller.showPhoneByBrand)
router.get('/search/phoneDetails',controller.showPhoneDetails);
router.post('/showDetail/addCart', controller.myAddCart);
router.get('/search/phoneDetails/:rating/:comment/:phoneId', controller.addOneComment);
router.get('/logout',controller.logout);


router.get('/login', controller.showLoginPage);
router.post('/login', controller.login);

router.get('/signup', controller.showSignUpPage);
router.post('/signup', controller.signUp);

router.get('/reset/:email', controller.showResetPage);
router.post('/reset', controller.resetPassword);

router.get('/forgot', controller.showForgotPwPage);
router.post('/forgot', controller.sendResetVerifyEmail);

router.get('/verify/:firstName/:lastName/:email/:hashedPw/', controller.showEmailVerificationPage);
router.post('/verify/:firstName/:lastName/:email/:hashedPw/', controller.createAccount);

router.get('/sent', controller.showSentPage);
router.post('/sent', controller.showLoginPage);

router.get('/checkout', controller.showCheckOutPage);
router.get('/checkout/checkStock', controller.checkStock);
router.get('/checkout/back', controller.checkoutBack);
router.get('/checkout/removeItem', controller.removeItem);
router.post('/checkout', controller.checkout);

router.get('/paid', controller.showMainPage);

router.get('/showUserPage', controller.showUserPage);
router.get('/showUserPage/:status', controller.showUserPage);
router.post('/confirmPassword', controller.confirmPassword);
router.get('/updateProfile', controller.updateProfile);
router.post('/updatePassword', controller.updatePassword);
router.get('/addPhoneList', controller.addOnePhone );
router.get('/deletePhoneList', controller.deleteOnePhone );
router.get('/disabledPhoneList', controller.disabledOnePhone );
router.get('/enabledPhoneList', controller.enabledOnePhone );


module.exports = router;