var mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/A2', { useNewUrlParser: true }, function(){
// 	console.log('mongodb connected')
// });
mongoose.connect('mongodb://localhost/demo', { useNewUrlParser: true }, function(){
	console.log('mongodb connected')
});

module.exports = mongoose;