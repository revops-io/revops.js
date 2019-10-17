var express = require('express')
var cors = require('cors')
var app = express()
var request = require('request')

const port = 5000

const sk = process.env.SK 

app.use(cors())
app.get('/token', function (req, res, next) {

  if(!!sk === false){
    console.warn("Cannot get token. Secret key is not set.")
  }

  let searchParams = new URLSearchParams({
    accountId: req.query.accountId,
  })

  const url = `https://vault.revops.io/token?${searchParams.toString()}`
  // const url = `http://localhost:5050/token?${searchParams.toString()}`

  let options = {
    url: url,
    method: 'GET',
    mode: 'cors',
    headers: {
      'Authorization': 'Bearer ' + sk,
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const r = JSON.parse(body)
      res.json({token: r.access_token})
    } else {
      res.json({token: false})
    }
  });
})

app.listen(port, function () {
  console.log(`CORS-enabled web server listening on port ${port}`)
})