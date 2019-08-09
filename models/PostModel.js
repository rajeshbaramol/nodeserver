const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

const registerUserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, required: true, index: true, lowercase: true, unique: true },
    password: String,
}, { timestamps: true });

registerUserSchema.plugin(uniqueValidator, { 'message': "this email already taken" });
registerUserSchema.methods.setPassword = password => bcrypt.hashSync(password);
registerUserSchema.methods.generateToken = () => jwt.sign({
    email: this.email,
}, process.env.JWT_SECRET);

registerUserSchema.methods.toAuthJson = () => {
    return {
        email: this.email,
        token: this.generateToken()
    }
}
module.exports = mongoose.model('regSchema', registerUserSchema);

