const express = require('express');

const server = express();
const port = process.env.PORT || 4009;

server.use(express.json());

server.listen(port, () => console.log(`Server listening on port ${port}`));
