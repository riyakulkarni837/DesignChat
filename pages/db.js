const mongoose = require('mongoose');
require('dotenv').config();

const DB = process.env.DATABASE;

mongoose.connect(DB, {
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(() => console.log("Database connected"))
  .catch((err) => console.log("Error connecting to database:", err));

// Define the log schema
const logSchema = new mongoose.Schema({
    role: String,
    content: String,
    date: { type: Date, default: Date.now },
});

// Clear model cache before redefining
if (mongoose.models['Log']) {
  delete mongoose.models['Log'];
}

// Define and export the Log model
const Log = mongoose.model('Log', logSchema);

module.exports = Log;
