
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);

let db;

async function connectDB() {
  await client.connect();

  db = client.db("booknook");

  console.log("MongoDB connected successfully!");
}

function getDB() {
  return db;
}

function getClient() {
  return client;
}

module.exports = { connectDB, getDB, getClient };
