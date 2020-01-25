const express = require('express');
const db = require('./data/helpers/projectModel.js');

const router = express.Router();

router.get('/', (req, res) => {
  db.get().then(response => {
    res.status(200).json(response);
  }).catch(err => {
    res.status(400).json({message: "Could not retrieve projects."});
  })
});

module.exports = router;
