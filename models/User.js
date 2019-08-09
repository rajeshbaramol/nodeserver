const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const schema = new mongoose.Schema({
    email: { type: String, required: true, index: true, lowercase: true },
    password: String,
}, { timestamps: true });

schema.methods.generateToken = () => {
    return jwt.sign({
        email: this.email,
    }, process.env.JWT_SECRET);
}
schema.methods.toAuthJson = () => {
    return {
        email: this.email,
        token: this.generateToken()
    }
}
schema.methods.unSyncPassword = (password) => bcrypt.compareSync(password, this.password);

module.exports = mongoose.model("User", schema);