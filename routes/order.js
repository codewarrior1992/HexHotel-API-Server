const router = require('express').Router();
const Room = require('../models/Room.js');
const User = require('../models/User.js');
const { calculatePrice } = require('../helpers/price.js');
const { verifyAccessToken } = require('../helpers/auth.js');

router.get('/all', verifyAccessToken, async(req,res)=>{
    const user = await User.findById({_id : req.query.uid});
    const orders = user['orders'];
    res.send({
        success : true,
        orders
    })
})

router.get('/item', verifyAccessToken, async (req,res)=>{
    const uid = req.query.uid;
    const oid = req.query.oid
    const user = await User.findById({_id : uid});
    const orders = user['orders'];
    const order = orders.filter((item)=> item.oid == oid)[0]
    res.send({
        order,
        success : true
    })
})

router.post('/create', verifyAccessToken, async(req,res)=>{
    const { uid, guest , reserve } = req.body

    const room = await Room.findById({ _id: reserve.rid });
    const range = reserve.range
    const total = calculatePrice(range, room)

    const order = {
        oid : Math.floor(Date.now() / 1000),
        guest : {
            name : guest.name,
            phone : guest.phone
        },
        room : { 
            title : room.title, 
            category : room.category,
            images : room.images,
            rid : room._id
        },
        range,
        total
    }

    const orderGenerate = await User.findOneAndUpdate(
        {_id : uid}, 
        { 
            $push: { orders : order } , 
        }, 
        { new: true  },
    )

    if(!orderGenerate) return res.sendStatus(400)

    res.send({
        message :  {
            'zh-TW' : '訂單建立成功',
            'en-US' : 'The order has been placed',
            'ja-JP' : '注文が確定しました',
        },
        success:true,
        oid : order.oid,
    })
})

router.patch('/update', verifyAccessToken, async (req,res)=>{
    const { rid, oid, range } = req.body
    const room = await Room.findOne({ _id: rid });

    const total = calculatePrice(range, room);
    
    let orderUpdate = await User.findOneAndUpdate(
        { "orders.oid" : oid },
        { $set : { "orders.$.range" : range, "orders.$.total" : total} },
        { new : true }
    );

    res.send({         
        message :  {
            'zh-TW' : '訂單已更新',
            'en-US' : 'The order has been updated',
            'ja-JP' : '注文が更新されました',
        }, 
        success : true,
        result : orderUpdate
    })
})

router.post('/delete', verifyAccessToken, async (req,res)=>{
    const { uid ,oid } = req.body;
    console.log(uid, oid)
    let orderDelete = await User.updateOne(
        { _id : uid },
        { $pull : { "orders" : { oid } } },
        { new: true  },
    );

    res.send({
        message :  {
            'zh-TW' : '訂單已刪除',
            'en-US' : 'The order has been deleted',
            'ja-JP' : '注文は削除されました',
        }, 
        success : true,
        result : orderDelete
    })
})

module.exports = router