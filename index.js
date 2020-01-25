const express = require('express');
const projectRoutes = require('./projectRoutes.js');
const actionRoutes = require('./actionRoutes.js');

function logger(req, res, next) {
  const now = new Date().toISOString();
  console.log(`${now}: ${req.method} to ${req.url}`);

  next();
}

const server = express();
const port = process.env.PORT || 4009;

server.use(express.json());
server.use(logger);

server.use('/projects', projectRoutes);
server.use('/actions', actionRoutes);

server.use(function(req, res, next) {
  res.status(404).send("That request cannot be processed.");
});

server.listen(port, () => console.log(`Server listening on port ${port}`));
