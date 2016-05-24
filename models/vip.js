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