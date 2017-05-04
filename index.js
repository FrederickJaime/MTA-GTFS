
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

  mtaKey = 'e853b54c8671a51a9f67a2d99f014264',
  mtaFeedId = "&feed_id=1";
  /*
    Feed IDs with Train Lines
    1  : 123456S
    16 : NQRW
    21 : BD
    2  : L
    11 : Staten Island Railway
  */

app.use(bodyParser.json());
app.set('port', process.env.PORT || 5000);


let mta = new Mta({
  key: mtaKey, // only needed for mta.schedule() method
  feed_id: 1                  // optional, default = 1
});



rp({
    method: 'GET',
    url: `http://datamine.mta.info/mta_esi.php?key=${mtaKey}${mtaFeedId}`,
    encoding: null,
}).then((buf) => {
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(buf);

   // console.log(feed.entity);

    const trips = feed.entity.filter(tripupdate =>{
        if (tripupdate.trip_update) {
            if(tripupdate.trip_update.trip.nyct_trip_descriptor.is_assigned){
               // console.log(tripupdate.trip_update.trip.nyct_trip_descriptor.is_assigned);
                return tripupdate;
            }   
        }
    }).filter(trip =>{
       // console.log(trip.trip_update.trip.nyct_trip_descriptor);
       if (trip.trip_update) {
           // console.log(trip.trip_update);
           // console.log(trip.trip_update.stop_time_update[0]);
            
       }
        
       

    });

   // const trips = feed.filter()

   /*
    feed.entity.forEach((entity) => {

        if (entity.trip_update) {
            console.log(entity.trip_update);
            
            
        }
    });
    */
}).catch(e => {

  console.log(e);

});





mta.status('bus').then(function (result) {
    const busStat = result.map(bus =>{

        //console.log(bus.name+' : '+bus.status);

    });
});
mta.stop('101').then(function (result) {
  //console.log(result);
}).catch(function (err) {
  //console.log(err);
});

mta.status('subway').then(function (result) {
                let z = result.filter(status =>{
                    if(status.status != 'GOOD SERVICE'){
                        //console.log(status.name);
                    }
                }).map(status => {
                    //return status.name
                });
});



const stationTrains = (trainStation) => new Promise((res, rej) => {

    let trains = mta.schedule(trainStation).then(function (allTrains) {

        const northboundTrains = allTrains.schedule[stopID].N.map( train =>{
            return train.routeId;
        });
        const southboundTrains = allTrains.schedule[stopID].S.map( train =>{
            return train.routeId;
        });

        let trainAtStop =   'NorthBound '+[...new Set(northboundTrains)]+' | SouthBound '+ [...new Set(southboundTrains)];

        return trainAtStop;   

    });
    
    res(trains);
    

});



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




app.get('/webhook', (req, res) => {
    let response;
    //console.log(req.body.result.action);
    /* Functions (none of these are finalized ):
        allSubwayDelays() // list of all subway delays | no paramater
        subwayStatus() // get specific train status | needs train ex: subwayStatus('7')
        stationTrains() gets list of trains from Station | needs train id ex: stationTrains(635)
    
    */
    response = stationTrains(635).then(data =>{
        res.send(data);
    });


});










app.listen(app.get('port'), () => console.log(`app running on port ${app.get('port')}`));

module.exports = app;
