
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

  app = express();

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
const allSubwayDelays = () => new Promise((res, rej) => {
     
     let delays =  mta.status('subway').then(function (allStatus) {
                    let z = allStatus.filter(status =>{
                        if(status.status != 'GOOD SERVICE'){
                            return status
                        }
                    }).map(status => {
                        return status.name
                    });
                    
                    return z;
                    
                }).catch(function (err) {
                    rej(err);
                });
    
    res(delays);

});


const subwayStatus = ( train ) => new Promise((res, rej) => {

     let trainStatus =  mta.status('subway').then(function (allStatus) {
                    let b = allStatus.filter(status =>{
                        if(status.name.includes( train )){
                            return status;
                        }
                    });
                    
                    const {
                        name:trainLine,
                        status,
                        text
                    } = b[0];
                   // console.log(b);
                    let trainMessage = `Subway Line ${train} has ${status.toLowerCase()}.
                    
                    ${text.replace(/<\/?[^>]+(>|$)/g, "").replace(/(&nbsp;)/g," ").replace(/\s+/g, " ")}`;

                    return trainMessage ;
                    
                }).catch(function (err) {
                    rej(err);
                });

    res(trainStatus);
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
    //console.log(req.body.result.action);
    /* Functions (none of these are finalized ):
        allSubwayDelays() // list of all subway delays | no paramater
        subwayStatus() // get specific train status | needs train ex: subwayStatus('7')
    
    */
    response = subwayStatus('F').then(data =>{
        res.send(data);
    });


});










app.listen(app.get('port'), () => console.log(`app running on port ${app.get('port')}`));

module.exports = app;
