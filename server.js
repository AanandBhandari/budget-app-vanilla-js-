const express = require('express');
const path = require('path');
var app = express();
const port  = process.env.PORT || 3000;
app.use( express.static( __dirname + '/client' ));
app
  .get( '/', function( req, res ) {
    res.sendFile( path.join( __dirname, 'client', 'index.html' ));
  });
  app.listen(port, () =>{
	console.log(`the server is running now on port  ${port}`);
});