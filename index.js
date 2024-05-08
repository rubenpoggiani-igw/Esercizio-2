const express = require('express');
const app = express();
const port = 3000;
const { MongoClient, ObjectId } = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const bodyParser = require('body-parser');
const dbName = 'esercizio1';
var collection;
// app.use(cors())


app.listen(port, async () => {
  await client.connect();
  console.log('Connected successfully to server!!');
  const db = client.db(dbName);
  collection = db.collection('1');
  console.log('Server is running on port 3000!!');
});


app.use(bodyParser.json());


app.get('/devices', async (req, res) => {
  try {
    let query = {};
    if (req.query.status) {
      query = Object.assign(query, { status: req.query.status });
    }
    if (req.query.q) {
      query = Object.assign(query, { name: { $regex: req.query.q, $options: 'i' } });
    }
    let devices = await collection.find(query).toArray();
    const charged = devices.filter(device => device.battery > 30);
    const uncharged = devices.filter(device => device.battery <= 30);
    const response = {
      data: devices
    };
    res.json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/devices', async (req, res) => {
  try {
    const { name, vehicle, status, battery } = req.body;
    if (!isNaN(battery))
      res.status(400).send({ message: "Dato non valido" });

    const result = await collection.insertOne({
      name: name,
      vehicle: vehicle,
      status: status,
      battery: battery
    });

    if (result.acknowledged === true) {
      res.status(201).send(await collection.find({ _id: result.insertedId }).toArray());
    }
  } catch (error) {
    console.error('Errore:', error);
  }
});


app.get('/devices/:id', async (req, res) => {
  try {
    res.send(await collection.find({ _id: ObjectId(req.params.id) }).toArray())
  } catch (error) {
    console.error('Errore:', error);
  }
});


app.delete('/devices/:id', async (req, res) => {
  try {
    const deviceId = req.params.id;
    const result = await collection.deleteOne({ _id: ObjectId(deviceId) });

    if (result.deletedCount === 1) {
      res.status(200).send('Elemento eliminato');
    } else {
      res.status(404).send('Elemento non trovato');
    }
  } catch (error) {
    console.error('Errore:', error);
  }
});
