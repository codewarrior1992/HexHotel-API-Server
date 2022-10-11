const router = require('express').Router();
const User = require('../models/User.js')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../helpers/validation.js')
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, verifyAccessToken } = require('../helpers/auth.js');

router.post('/register',async (req,res)=>{
    const { error } = registerValidation(req.body);
    if(error) return res.send(error.details[0].message);

    const existEmail = await User.findOne({email:req.body.email});
    if(existEmail) return res.send({ 
        message : {
            'zh-TW' : '此信箱已經被註冊',
            'en-US' : 'Email was already registered',
            'ja-JP' : 'メールアドレスは既に登録されています',
        }
    })

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt)

    try {
        const user = new User ({
            email : req.body.email,
            password: hashPass
        })
        const saveUser = await user.save();

        res.send({ 
            success :true,
            message : {
                'zh-TW' : '註冊成功',
                'en-US' : 'Register succeeded',
                'ja-JP' : '登録成功',
            }, 
        })
    
    } catch(error){
        res.send({ message : error })
    }
})

router.post('/log-in', async (req,res)=>{

    const {error} = loginValidation(req.body);
    if(error) res.status(400).send(error.details[0].message);
            
    const user = await User.findOne({email:req.body.email});
    if(!user) return res.send({ 
        message : {
                'zh-TW' : '此信箱並不存在',
                'en-US' : 'This account does not exist',
                'ja-JP' : 'このアカウントは存在しません',
        },
        success : false
    })

    const decodePass = await bcrypt.compare(req.body.password, user.password)
    if(!decodePass) return res.send({ 
        message :  {
            'zh-TW' : '錯誤的密碼',
            'en-US' : 'Wrong password',
            'ja-JP' : '間違ったパスワード',
        },
        success : false
    })

    const access_token = generateAccessToken(user._id);
    const refresh_token = generateRefreshToken(user._id);

    await User.findOneAndUpdate({ _id : user._id }, { $set: { refresh_token }}, { new : true })
    
    res.header('Authorization', access_token ).send({
        message :  {
            'zh-TW' : '登入成功',
            'en-US' : 'Log in succeed',
            'ja-JP' : 'ログイン成功',
        },
        success :true,
        access_token, 
        refresh_token, 
        _id : user._id 
    })
})

router.post('/log-out', async(req,res) => {
    await User.findByIdAndUpdate({ _id : req.body.uid}, { $set: { refresh_token : '' }})
    res.send({
        success : true,
        message :  {
            'zh-TW' : '登出成功',
            'en-US' : 'Log out succeed',
            'ja-JP' : 'サインアウト成功',
        },
    })
})

router.post('/is-logged-in', verifyRefreshToken , async(req,res) => {
    try{
        res.send({
            success : true,
        })
    } catch(err){
        if(err) return res.status(403)
    }
})

router.post('/refresh-token', verifyRefreshToken, async (req,res)=>{
    try{
        const decoded = req.user;

        const access_token = generateAccessToken(decoded._id);
        const refresh_token = generateRefreshToken(decoded._id);

        await User.findOneAndUpdate({ _id : decoded._id }, { $set: { refresh_token }}, { new : true })

        res.header('Authorization', refresh_token ).status(200).send({
            access_token, 
            refresh_token, 
            _id : decoded._id
        })
    } catch (err){
        if(err) return res.sendStatus(403);
    }
})

module.exports = router