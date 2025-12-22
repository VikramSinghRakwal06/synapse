const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    userName :{ type:String,required: true, unique:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    avatar:{type:String, default:""}
},{timestamps:true});

userSchema.pre('save',async function (next){
    if(!this.isModified('password'))return next();
    this.password=await bcrypt.hast(this.password, 10);
    next();
})

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(this.password,enteredPassword);
}

module.exports = mongoose.model('User', userSchema);