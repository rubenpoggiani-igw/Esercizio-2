const express = require('express');
const app = express();
const port = 3000

const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

const dbName = 'esercizio1';
var collection;


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

    if (req.query.connected) {
      devices = devices.filter(device => device.status === (req.query.connected === 'true' ? 'connected' : 'disconnected'));
    }

    const charged = devices.filter(device => device.battery > 30);
    const uncharged = devices.filter(device => device.battery <= 30);

    const response = {
      charged: charged.sort((a, b) => b.battery - a.battery),
      uncharged: uncharged.sort((a, b) => a.battery - b.battery)
    };

    res.json(response);
  }
  catch (error) {
    console.error('Errorrrr:', error);
  }
});

app.get('devices', asunc(req, res) => {

});








// app.get('/devices-test', async (req, res) => {
//   try {
//     let devices = await collection.find().toArray();

//     if (req.query.connected) {
//       devices = devices.filter(device => device.status === (req.query.connected === 'true' ? 'connected' : 'disconnected'));
//     }

//     const charged = devices.filter(device => device.battery > 30);
//     const uncharged = devices.filter(device => device.battery <= 30);

//     const response = {
//       charged: charged.sort((a, b) => b.battery - a.battery),
//       uncharged: uncharged.sort((a, b) => a.battery - b.battery)
//     };

//     res.json(response);
//   }
//   catch (error) {
//     console.error('Errorrrr:', error);
//   }
// });



