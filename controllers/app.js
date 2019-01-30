const app = require('express')();

app.get('/', (req, res) => {
  res.render('index');
});

module.exports = app;