const express = require('express');
const router = express.Router();
const {ensureAuth, ensureGuest} = require('../middleware/auth');

const Recipe = require('../models/Recipe');

// @desc    Login/Landing page
// @route   Get /
router.get('/', ensureGuest,(req, res) => {
    res.render('login', {
        layout: 'login'
    })
});


// @desc    Dashboard
// @route   Get /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {

    try {
        const recipes = await Recipe.find({user: req.user.id}).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            recipes
        });
    } catch (error) {
        console.log(error);
        res.render('error/500')
    }

    
});

// @desc    Contact
// @route   Get /contact
router.get('/contact', ensureAuth, async (req, res) => {

    res.render('contact');

    
});

module.exports = router