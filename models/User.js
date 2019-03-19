const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String
}, {
    timestamps: true
});

module.exports = User = mongoose.model('user', userSchema);