const express = require('express')
const passport = require('passport')
const Poem = require('../models/poem')

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404

// INDEX
// GET /poems
router.get('/poems', requireToken, (req, res, next) => {
  Poem.find()
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
    .then(handle404)
    .then(poem => res.status(200).json({ poem: poem.toObject() }))
    .catch(next)
})

// CREATE
// POST /poems
router.post('/poems', requireToken, (req, res, next) => {
  Poem.create(req.body.poem)
    .then(poem => {
      res.status(201).json({ poem: poem.toObject() })
    })
    // if theres an error, sent it to error handler along with the 'res` object
    .catch(next)
})
