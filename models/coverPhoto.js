var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
    name: 'CoverPhoto',
    schema: new Schema({
        say: String,
        photo: String,
    })
};
