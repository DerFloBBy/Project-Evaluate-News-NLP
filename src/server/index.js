const dotenv = require('dotenv');
dotenv.config();

var path = require('path');
const mockAPIResponse = require('./mockAPI.js');
const { log } = require('console');
const FormData = require('form-data');
const fetch = require('node-fetch');

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware */
// Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
const { send } = require('process');
app.use(cors());

// * To not get an 'self signed certificate in certificate chain' error when fetching
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Initialize the main project folder
app.use(express.static('dist'));

// designates what port the app will listen to for incoming requests
app.listen(8081, function() {
    console.log('Example app listening on port 8081!');
});

console.log(__dirname);

//
// Start API Routes
//

app.get('/', function(req, res) {
    res.sendFile('dist/index.html');
});

const apiURL = 'https://api.meaningcloud.com/sentiment-2.1';

app.post('/api', function(req, res) {
    const formdata = new FormData();
    formdata.append('key', process.env.API_KEY);
    formdata.append('txt', req.body.text);
    formdata.append('lang', 'en'); // 2-letter code, like en es fr ...

    const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    const response = fetch(apiURL, requestOptions)
        .then((response) => {
            const body = response.json();
            return body;
        })

        .then((body) => {
            const text = body.sentence_list[0].text;
            const irony = body.irony;
            const polarity = body.score_tag;

            sentimentData = { text, irony, polarity };

            return sentimentData;
        })
        .then((sentimentData) => {
            console.log(sentimentData);
            res.send(sentimentData);
        })
        .catch((error) => console.log('ERROOORRR', error));
});
