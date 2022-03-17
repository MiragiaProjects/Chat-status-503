/***
 * 
 * Socket Controller
 */


const debug = require('debug')('game:socket_controller');

module.exports = {}

const express = require('express'); // Express contains some boilerplate to for routing and such
const io = require('socket.io')(http); // Here's where we include socket.io as a node module 

// Serve the index page 
app.get("/", function (request, response) {
    response.sendFile(__dirname + '/index.html'); 
  });
  
  // Serve the assets directory
  app.use('/assets',express.static('assets'))


// Listen on port 3000
app.set('port', (process.env.PORT || 3000));
http.listen(app.get('port'), function(){
  console.log('listening on port',app.get('port'));
}); 

