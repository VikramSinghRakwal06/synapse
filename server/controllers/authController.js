const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET, {expiresIn:'30d'});
};

exports.registerUser =async (req, res)=>{
    const {userName, email, password, avatar}= req.body;
    try {
        const userExists =await User.findOne({email});
        if(userExists) return res.status(400).json({message:"user already exists"});
        const user = await User.create({userName, email, password, avatar});
        if(user){
            res.status(201).json({
                _id: user.id,
                userName : user.userName, 
                email: user.email,
                avatar: user.avatar,
                token : generateToken(user._id),
            })
        }
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

exports.loginUser = async(req,res)=>{
    const {email , password}= req.body;
    try {
        const user = await User.findOne({email});
        if(user && (await user.matchPassword(password))){
            res.status(200).json({
                _id: user.id,
                userName: user.userName,
                email: user.email,
                avatar: user.avatar,
                token: generateToken(user._id),

            })
        }else{
            res.status(400).json({message:"Invaild credentials"});
        }
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}