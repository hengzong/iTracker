// Load required packages

	import mongoose from 'mongoose';

	// Define our user schema
	var User = new mongoose.Schema({
	    name: {type: String, required:true},
			email: {type: String, required:true, unique: true},
			password: {type: String, required:true},
			bookmarks:{type:[String], default:[]},
			auth_token: {type: String},
			auth_token_exp: {type: Date},
	    dateCreated: {type: Date, default: Date.now}
	});


	// Export the Mongoose model
	module.exports = mongoose.model('user', User);
