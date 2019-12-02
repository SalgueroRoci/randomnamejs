const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const express = require('express');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/documents.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Docs API.
    authorize(JSON.parse(content), printName);
    });


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client); 
    });
  });
}

/**
 * Prints the title of a sample doc: 
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth 2.0 client.
 */

function printName(auth) {
  const docs = google.docs({version: 'v1', auth});

  docs.documents.get({
    documentId: '18sd9MZpHACVHEY9BhHUEQm8QQxqJ4GYbfgz9w_-u39s',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    var docbody = res.data.body.content;
    var min = 0, max = docbody.length;   
    var index, data;
    
    app.get("/randoname", (req, res, next) => {  
        res.setHeader('Access-Control-Allow-Origin', '*');

        index = Math.floor(Math.random() * (max - min +1)) + min;
        data = docbody[index].paragraph.elements[0].textRun.content;

        var name = {name: data};
        console.log(`Random name is: ${data}` );
        res.json(name);
        });
  });
}

var app = express();

app.use(express.static('public'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/images', express.static(__dirname + '/public/images'));

app.listen(3000, () => {
 console.log("Server running on port 3000");
});

//======
// var main = express();
// main.use(express.static('public'));

// //make way for some custom css, js and images
// main.use('/css', express.static(__dirname + '/public/css'));
// main.use('/js', express.static(__dirname + '/public/js'));
// main.use('/images', express.static(__dirname + '/public/images'));

// var server = main.listen(8081, function(){
//     var port = server.address().port;
//     console.log("Server started at http://localhost:%s", port);
// });
