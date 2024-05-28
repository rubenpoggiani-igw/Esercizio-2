const express = require('express');
const app = express();
const port = 3000;
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'esercizio1';
let collection;

app.use(cors());
app.use(express.json());

app.listen(port, async () => {
  await client.connect();
  console.log('Connected successfully to server!!');
  const db = client.db(dbName);
  collection = db.collection('1');
  console.log(`Server is running on port ${port}!!`);
});

// Filtra i dispositivi per stato e ordina per livello della batteria
app.get('/devices', async (req, res) => {
  try {
    let devices = await collection.find().toArray();

    if (req.query.status) {
      const statusFilter = req.query.status === 'true' ? 'connected' : 'disconnected';
      devices = devices.filter(device => device.status === statusFilter);
    }

    const response = {
      data: devices.sort((a, b) => b.battery - a.battery),
    };

    res.json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching devices' });
  }
});

// Cerca i dispositivi per nome
app.get('/devices/search', async (req, res) => {
  try {
    const searchQuery = req.query.name;
    const devices = await collection.find({ name: { $regex: searchQuery, $options: 'i' } }).toArray();

    const response = {
      data: devices,
    };

    res.json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while searching for devices' });
  }
});

// Aggiungi un nuovo dispositivo
app.post('/devices', async (req, res) => {
  try {
    const { name, vehicle, status, battery } = req.body;

    const newDevice = {
      name,
      vehicle,
      status,
      battery,
    };

    const result = await collection.insertOne(newDevice);
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while adding the device' });
  }
});

// Elimina un dispositivo
app.delete('/devices/:id', async (req, res) => {
  try {
    const deviceId = req.params.id;

    if (!ObjectId.isValid(deviceId)) {
      return res.status(400).json({ error: 'Invalid device ID' });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(deviceId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while deleting the device' });
  }
});
