const express = require('express'),
  request = require('request'),
  bodyParser = require('body-parser'),
  app = express();

app.use(bodyParser.json());
app.set('port', process.env.PORT || 5000);



//


app.post('/webhook', (req, res) => {
  let response;
console.log(req.body.result.action);
  switch (req.body.result.action) {
    case 'willItRain':
      response = willItRain(req.body.result.parameters);
      break;
    default:
      response = getCurrentWeather(req.body.result.parameters);
      break;
  }

  response.then((data) => {
    res.set('Content-type', 'application/json');
    res.send(data);
  });
});

app.listen(app.get('port'), () => console.log(`app running on port ${app.get('port')}`));

module.exports = app;
