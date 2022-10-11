const mongoose = require('mongoose');

const RoomSchema = mongoose.Schema({
    title : {
        type : Object
    },
    images : {
        type : Array
    },
    category : {
        type : Object
    },
    description : {
        type : Object
    },
    introduction : {
        type : Object
    },
    amenities : {
        type : Object
    },
    weekdaysPrice : {
        type : Object
    },
    weekendPrice : {
        type : Object
    },
    fee : {
        type : Object
    },
    recommend : {
        type : Boolean
    }
})

module.exports = mongoose.model('Rooms', RoomSchema)