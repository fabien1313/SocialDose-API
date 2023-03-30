const express = require('express'); 
const db = require('./config/connection'); 
const routes = require('./controllers'); 

const PORT = process.env.PORT || 3001; 
const app = express(); 

app.use(express.urlencoded({ extended: true })); // Middleware parsing incoming HTTP POST requests where the body contains data encoded in the URL-encoded format. True - allows for parsing of nested objects.
app.use(express.json()); //Middleware parsing HTTP request bodies that use JSON format.
app.use(routes);


db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
    });
  });
