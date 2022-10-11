const jwt =require('jsonwebtoken');
const User = require('../models/User.js');

function generateAccessToken (_id){
    return jwt.sign({ _id }, process.env.SECRET_CODE, { expiresIn: 1000 * 60 * 30 })
}

function generateRefreshToken (_id){
    return jwt.sign({ _id }, process.env.SECRET_CODE, { expiresIn: '1h'})
}

function verifyAccessToken (req,res,next){
    try{
        let access_token;
        req.headers.authorization? 
        access_token = req.headers.authorization.replace('Bearer ','') :
        access_token = req.body.headers.Authorization.replace('Bearer ','');

        const decoded = jwt.verify(access_token, process.env.SECRET_CODE);
        req.user = decoded
        next()
    }catch(err){
        if(err) return res.sendStatus(401)
    }
}

async function verifyRefreshToken (req,res,next){
    try{
        let refresh_token;
        req.headers.authorization ? 
        refresh_token = req.headers.authorization.replace('Bearer ','') :
        refresh_token = req.body.headers.Authorization.replace('Bearer ','');

        const decoded = jwt.verify(refresh_token, process.env.SECRET_CODE); 

        const user = await User.findOne({ _id : decoded._id });
        const user_token = user.refresh_token;
        if (refresh_token !== user_token) return res.sendStatus(403);
        req.user = decoded;
        next()
    } catch (err) {
        console.log(err)
        if(err) return res.sendStatus(403);
    }
}

module.exports.generateAccessToken = generateAccessToken;
module.exports.generateRefreshToken = generateRefreshToken;
module.exports.verifyAccessToken = verifyAccessToken;
module.exports.verifyRefreshToken = verifyRefreshToken;
