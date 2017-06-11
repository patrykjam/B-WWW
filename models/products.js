var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var Schema = mongoose.Schema;

// create a schema
var productSchema = new Schema({
    id: {type: Number},
    name: {type: String, required: true},
    type: {type: String, required: true},
    specs: {type: String, default: 'Brak'},
    images: {type: Array, required: true}
});

productSchema.plugin(autoIncrement.plugin, {model: 'Product', field: 'id'});

var Product = mongoose.model('Product', productSchema);

module.exports = Product;
