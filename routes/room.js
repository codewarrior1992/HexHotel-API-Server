const router = require('express').Router();
const Room = require('../models/Room.js')

router.get('/all', async(req,res)=>{
    const rooms = await Room.find({});
    res.send({
        success : true,
        rooms
    })
})

router.get('/:id', async(req,res)=>{
    const room = await Room.findOne({_id : req.params.id});
    res.send({
        success : true,
        room
    })
})

router.post('/create', async(req,res)=>{
    const { title, images, category, description, introduction, 
            amenities, weekdaysPrice ,weekendPrice, fee, recommend } = req.body;

    const room = new Room({
        title,
        images,
        category,
        description,
        introduction,
        amenities,
        weekdaysPrice,
        weekendPrice,
        fee,
        recommend
    });

    const saveRoom = await room.save();
    
    res.send({
        room : saveRoom 
    })
})

module.exports = router