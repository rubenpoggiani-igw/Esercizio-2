const express = require('express');
const app = express();
const port = 3000
const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'esercizio1';
var collection;

const cors = require('cors')
app.use(cors())


app.listen(port, async () => {
  await client.connect();
  console.log('Connected successfully to server!!');
  const db = client.db(dbName);
  collection = db.collection('1');
  console.log('Server is running on port 3000!!')
});


app.get('/devices', async (req, res) => {
  try {
    let devices = await collection.find().toArray();

    if (req.query.status) {
      devices = devices.filter(device => device.status === (req.query.status === 'true' ? 'connected' : 'disconnected'));
    }

    const response = {
      data: devices.sort((a, b) => b.battery - a.battery)
    };

    res.json(response);
  }
  catch (error) {
    console.error('Errorrrr:', error);
  }
});


