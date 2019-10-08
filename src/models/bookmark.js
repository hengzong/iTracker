// Load required packages

	import mongoose from 'mongoose';


	// Define our user schema
	var BookmarkSchema = new mongoose.Schema({
	    name: {type: String, default: "New Folder"},
			urlList: {type: [String], default: []},
	    assignedUser: {type: String, default: ""},

	    dateCreated: {type: Date, default: Date.now}
	});


	// Export the Mongoose model
	module.exports = mongoose.model('bookmark', BookmarkSchema);
