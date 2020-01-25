const express = require('express');
const db = require('./data/helpers/actionModel.js');
const projectDB = require('./data/helpers/projectModel.js');

const router = express.Router();

router.get('/', (req, res) => {
  db.get().then(response => {
    res.status(200).json(response);
  }).catch(err => {
    res.status(500).json({message: "Could not retrieve actions"});
  })
});

router.get('/:id', validateActionId, (req, res) => {
  res.status(200).json(req.action);
});

router.post('/', validateAction, (req, res) => {
  db.insert(req.body).then(response => {
    res.status(200).json(response);
  }).catch(err => {
    res.status(500).json({message: "Unable to create action"});
  })
});

router.put('/:id', validateActionId, validateAction, (req, res) => {
  const { id } = req.params;
  db.update(id, req.body).then(response => {
    res.status(200).json(response);
  }).catch(err => {
    res.status(500).json({message: "Unable to update action"});
  })
});

router.delete('/:id', validateActionId, (req, res) => {
  const { id } = req.params;
  db.remove(id).then(response => {
    res.status(200).json(response);
  }).catch(err => {
    res.status(500).json({message: "Unable to delete action"});
  })
});

// Custom Middleware

function validateActionId(req, res, next) {
  const { id } = req.params;
  db.get(id).then(response => {
    if (response) {
      req.action = response;
      next();
    } else {
      res.status(404).json({message: "An action with that id does not exist"});
    }
  }).catch(err => {
    res.status(500).json({message: "Error retrieving action"});
  })
}

function validateAction(req, res, next) {
  if (!req.body.project_id || !req.body.description || !req.body.notes) {
    res.status(400).json({message: "Please provide project id, description, and notes."});
  } else {
    projectDB.get(req.body.project_id).then(response => {
      if (response) {
        console.log(response);
        next();
      } else {
        res.status(404).json({message: "Project not found, please provide a valid project id."})
      }
    }).catch(err => {
      res.status(500).json({message: "Unable to retrieve project"});
    })
  }
}

module.exports = router;
