const express = require('express')
const passport = require('passport')
const router = express.Router()


// @desc    Auth with google
// @route   Get /auth/google
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile'] })
);


// @desc    Google auth callback
// @route   Get /auth/google/callback
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/dashboard');
    }
);


// @desc    Logout user
// @route   /auth/logout
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});


module.exports = router