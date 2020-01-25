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

router.get('/:id', validateProjectId, (req, res) => {
  res.status(200).json(req.project);
});

router.get('/:id/actions', validateProjectId, (req, res) => {
  const { id } = req.params;
  db.getProjectActions(id).then(response => {
    res.status(200).json(response);
  }).catch(err => {
    res.status(500).json({message: "Error retrieving project actions"});
  })
})

router.post('/', validateProject, (req, res) => {
  db.insert(req.body).then(response => {
    res.status(200).json(response);
  }).catch(err => {
    res.status(500).json({message: "Error creating new project"});
  })
});

router.put('/:id', validateProjectId, validateProject, (req, res) => {
  const { id } = req.params;
  db.update(id, req.body).then(response => {
    res.status(200).json(response);
  }).catch(err => {
    res.status(500).json({message: "Unable to update project"});
  })
});

router.delete('/:id', validateProjectId, (req, res) => {
  const { id } = req.params;
  db.remove(id).then(response => {
    res.status(200).json(response);
  }).catch(err => {
    res.status(500).json({message: "Unable to delete project"});
  })
})

// Custom Middleware

function validateProjectId(req, res, next) {
  const { id } = req.params;
  db.get(id).then(response => {
    if (response) {
      req.project = response;
      next();
    } else {
      res.status(404).json({message: "A project with that id does not exist"});
    }
  }).catch(err => {
    res.status(500).json({message: "Error retrieving project"});
  })
}

function validateProject(req, res, next) {
  if (!req.body.name || !req.body.description) {
    res.status(400).json({message: "Please include project name and description"});
  } else {
    next();
  }
}

module.exports = router;
