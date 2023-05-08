const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
    email: { type: String, required: true, index:true},
    password: { type: String, required: true},
    hashedPass: { type: String}
});


module.exports = mongoose.model("users", userSchema);