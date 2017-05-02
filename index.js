
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



mta.stop(635).then(function (stop) {

    if(stop.stop_name === '14 St - Union Sq'){
        console.log(stop.stop_id);
    }

  
});
*/
const subwayDelay = (myTrain) => new Promise((res, rej) => {

     let x =  mta.status('subway').then(function (allStatus) {
                    let z = allStatus.filter(status =>{
                        
                        if(status.status != 'GOOD SERVICE'){
                            return status
                        }
                    }).map(status => { return status.name });
                    
                    return z.toString();
                    
                }).catch(function (err) {
                    console.log(err);
                });

    res(x);

});


mta.status('subway').then(function (allStatus) {
  //console.log(allStatus);
  let myTrain = '7';
  const v = allStatus.filter(status =>{

    if(status.status != 'GOOD SERVICE'){
       //console.log(status.name);
        if(status.name.includes(myTrain)){
            //return status;
            //return (myTrain+' has '+status.status+'  '+status.text.replace(/<\/?[^>]+(>|$)/g, "").replace(/(&nbsp;)/g," ").replace(/\s+/g, " "));
            console.log(myTrain+' has '+status.status+'  '+status.text.replace(/<\/?[^>]+(>|$)/g, "").replace(/(&nbsp;)/g," ").replace(/\s+/g, " "));
        }
    }
  });
  
  
});

/*
mta.stop(635).then(function (result) {
 
    console.log(result);

    for (var key in result) {
        if (result.hasOwnProperty(key)) {
            console.log(key + " -> " + result[key]);
        }
    }

});
*/
/*

mta.schedule(635).then(function (result) {
  console.log(result);
});
*/


app.get('/webhook', (req, res) => {
    let response;


    response = subwayDelay('7').then(data =>{
        res.send(data);

    });


});










app.listen(app.get('port'), () => console.log(`app running on port ${app.get('port')}`));

module.exports = app;
