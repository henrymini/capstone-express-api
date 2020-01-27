const express = require('express')
const passport = require('passport')

const Poem = require('../models/poem')

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

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
