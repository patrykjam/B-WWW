var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var basketSchema = new Schema({
    id: {type: Number},
    username: {type: String, required: true},
    product_id: {type: Number}
});

basketSchema.plugin(autoIncrement.plugin, {model: 'Basket', field: 'id'});

var Basket = mongoose.model('Basket', basketSchema);

module.exports = Basket;
