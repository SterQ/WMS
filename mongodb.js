const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/WMS", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Błąd połączenia z bazą danych:"));
db.once("open", () => {
  console.log("Połączono z bazą danych MongoDB");
});

module.exports = db;
