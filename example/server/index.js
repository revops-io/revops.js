var express = require('express')
var cors = require('cors')
var request = require('request')


// We use port 5000 for the example but this is completely up to you
const port = 5000

// KEY is an environment variable we set at runtime.
const key = process.env.KEY 

let app = express()

app.use(cors())

/**
 * This defines an endpoint that we can request from the application to get an
 * access token. This token can be used to access RevOps resources.
 */
app.get('/token', function (req, res, next) {

  if(!!key === false){
    console.warn("Cannot get token. No key is set.")
  }

  const searchParams = new URLSearchParams({
    accountId: req.query.accountId,
  })

  const url = `https://vault.revops.io/token?${searchParams.toString()}`

  const options = {
    url: url,
    method: 'GET',
    mode: 'cors',
    headers: {
      'Authorization': 'Bearer ' + key,
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const token_response = JSON.parse(body)
      res.json({access_token: token_response.access_token})
    } else {
      res.json({access_token: false})
    }
  });
})

app.listen(port, function () {
  console.log(`CORS-enabled web server listening on port ${port}`)
})