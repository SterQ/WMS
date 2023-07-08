const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  nazwa: {
    type: String,
    required: true,
  },
  rodzaj: {
    type: String,
    required: true,
  },
  dzial: {
    type: String,
    required: true,
  },
  ilosc: {
    type: Number,
    required: true,
  },
  data: {
    type: Date,
    default: Date.now,
  },
  cena: {
    type: Number,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
