const express = require('express');
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT || 3000;
const controllers = require('./controllers');

// set view engine to ejs
app.set('view engine', 'ejs');

// setup express to use controllers
app.use(controllers);

// start http server
server.listen(port, () => {
  console.log(`Express listening on port ${port}`);
});

