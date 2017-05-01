const express = require('express'),
  GtfsRealtimeBindings = require('mta-gtfs-realtime-bindings'),
  request = require('request'),
  rp = require('request-promise'),
  protobuf = require("protobufjs"),
  bodyParser = require('body-parser'),
  app = express(),

  mtaKey = "e853b54c8671a51a9f67a2d99f014264",
  mtaFeedId = "&feed_id=1";

app.use(bodyParser.json());
app.set('port', process.env.PORT || 5000);


rp({
    method: 'GET',
    url: `http://datamine.mta.info/mta_esi.php?key=${mtaKey}${mtaFeedId}`,
    encoding: null,
}).then((buf) => {
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(buf);
    feed.entity.forEach((entity) => {
        console.log(entity);
        if (entity.trip_update) {
            console.log(entity.trip_update);
        }
    });
}).catch(e => {

  console.log(e);

});




app.get('/webhook', (req, res) => {
  let response;
 console.log(req.body);

  res.send("str");
  

});

app.listen(app.get('port'), () => console.log(`app running on port ${app.get('port')}`));

module.exports = app;
