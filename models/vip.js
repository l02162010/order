var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
    name: 'Vip',
    schema: new Schema({
        phone: String,
        password: String,
        displayName: String
    })
};

db.vips.insert({"phone":"0900123456","password":"123456","displayName":"測試用A"})
