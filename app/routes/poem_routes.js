const express = require('express')
const passport = require('passport')
const Poem = require('../models/poem')

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const removeBlanks = require('../../lib/remove_blank_fields')
const requireOwnership = customErrors.requireOwnership

// INDEX
// GET /poems
router.get('/poems', requireToken, (req, res, next) => {
  Poem.find()
    .populate('owner', 'email')
    .then(poems => {
      // uses .map to convert 'poems' to POJO to use .toObject
      return poems.map(poem => poem.toObject())
    })
    .then(poems => res.status(200).json({ poems: poems }))
    .catch(next)
})

// SHOW
// GET /poems/<ID>
router.get('/poems/:id', requireToken, (req, res, next) => {
  // req.params.id will is set to the `:id` passed
  Poem.findById(req.params.id)
    // custom error handler for 404
    .populate('owner')
    .then(handle404)
    .then(poem => res.status(200).json({ poem: poem.toObject() }))
    .catch(next)
})

// CREATE
// POST /poems
router.post('/poems', requireToken, (req, res, next) => {
  req.body.poem.owner = req.user.id
  Poem.create(req.body.poem)
    .then(poem => {
      res.status(201).json({ poem: poem.toObject() })
    })
    .catch(next)
})

// UPDATE
// PATCH /poems/<ID>
router.patch('/poems/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.poem.owner
  Poem.findById(req.params.id)
    .then(handle404)
    .then(poem => {
      requireOwnership(req, poem)
      return poem.updateOne(req.body.poem)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
// DELETE /poems/<ID>
router.delete('/poems/:id', requireToken, (req, res, next) => {
  Poem.findById(req.params.id)
    .then(handle404)
    .then(poem => {
      poem.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
