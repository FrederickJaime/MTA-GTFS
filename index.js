const express = require('express'),
  request = require('request'),
  bodyParser = require('body-parser'),
  app = express();

app.use(bodyParser.json());
app.set('port', process.env.PORT || 5000);







app.get('/webhook', (req, res) => {
  let response;
//console.log(req.body.result.action);

  res.send("str");

});

app.listen(app.get('port'), () => console.log(`app running on port ${app.get('port')}`));

module.exports = app;
