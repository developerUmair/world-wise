const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  const URI = process.env.MONGO_URI
  console.log(URI)
  try {
    await mongoose.connect(URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
