const getDatesInRange = function(start, end) {
    const dates = [];
    const date = new Date(start);
    
    while (date <= end) {
        start = date.toISOString().slice(0, 10);
        dates.push(start);
        date.setDate(date.getDate() + 1);
    };
    
    let weekdays = [];
    let weekend = [];

    dates.forEach((d)=>{
        new Date(d).getDay() === 6 || new Date(d).getDay() === 0 ? weekend.push(d) : weekdays.push(d)
    })
    
    return { 
        weekdaysLth : weekdays.length, 
        weekendLth : weekend.length
    }
}

const calculatePrice = function(range, room){
    const weekendPrice = room.weekendPrice;
    const weekdaysPrice =  room.weekdaysPrice;
    const fee = room.fee;

    const start = new Date(range.start);
    const end = new Date(range.end);
    const { weekdaysLth , weekendLth } = getDatesInRange(start, end);

    const total = {
        'zh-TW': weekdaysPrice['zh-TW'] * weekdaysLth + weekendPrice['zh-TW'] * weekendLth + fee['zh-TW'],
        'en-US': weekdaysPrice['en-US'] * weekdaysLth + weekendPrice['en-US'] * weekendLth + fee['en-US'],
        'ja-JP': weekdaysPrice['ja-JP'] * weekdaysLth + weekendPrice['ja-JP'] * weekendLth + fee['ja-JP'],
    }
    return total
}

module.exports.calculatePrice = calculatePrice
