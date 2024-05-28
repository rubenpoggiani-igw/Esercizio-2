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
app.use(express.json())


app.listen(port, async () => {
  await client.connect();
  console.log('Connected successfully to server!!');
  const db = client.db(dbName);
  collection = db.collection('1');
  console.log('Server is running on port 3000!!')
});

// crea i filtri per i dispositivi
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

// crea la ricerca per i dispositvi
app.get('/devices/search', async (req, res) => {
  try {
    const searchQuery = req.query.name;

    const devices = await collection.find({ name: { $regex: searchQuery, $options: 'i' } }).toArray();

    const response = {
      data: devices
    };

    res.json(response);
  } catch (error) {
    console.error('Error:', error);
  }
});


// aggiunge nuovi dispositivi
app.post('/devices', async (req, res) => {
  try {
    const { name, vehicle, status, battery } = req.body;

    const newDevice = {
      name: name,
      vehicle: vehicle,
      status: status,
      battery: battery
    };

    const result = await collection.insertOne(newDevice);
    return res.json(result);

  } catch (error) {
    console.error('Error:', error);
  }
});

app.delete('/devices', function (req, res) {})