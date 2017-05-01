
"use strict";
const express = require('express'),
  GtfsRealtimeBindings = require('mta-gtfs-realtime-bindings'),
  request = require('request'),
  rp = require('request-promise'),
  protobuf = require("protobufjs"),
  ByteBuffer = require("bytebuffer"),
  Long = require("long"),
  Mta = require('mta-gtfs'),
  bodyParser = require('body-parser'),
  app = express(),

  mtaKey = "e853b54c8671a51a9f67a2d99f014264",
  mtaFeedId = "&feed_id=1";

app.use(bodyParser.json());
app.set('port', process.env.PORT || 5000);


let mta = new Mta({
  key: 'e853b54c8671a51a9f67a2d99f014264', // only needed for mta.schedule() method
  feed_id: 1                  // optional, default = 1
});







/*
mta.status('subway').then(function (result) {
  console.log(result);
});
*/
/*
mta.schedule(635).then(function (result) {
  console.log(result);
});
*/


mta.stop().then(function (result) {
  console.log(result);
}).catch(function (err) {
  console.log(err);
});

/*
mta.stop(635).then(function (result) {
  console.log(result);
});
mta.schedule(635).then(function (result) {
  console.log(result);
});
*/


    app.get('/webhook', (req, res) => {
    let response;
    console.log(req.body);

    res.send(`<div>ddd</div>`);
    

    });










app.listen(app.get('port'), () => console.log(`app running on port ${app.get('port')}`));

module.exports = app;
