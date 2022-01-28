const express = require('express');
const router = express.Router();
const {ensureAuth} = require('../middleware/auth');
const Recipe = require('../models/Recipe');
const User = require('../models/User');

// @desc    Show add page
// @route   Get /recipes/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('recipes/add')
});


// @desc    Process add form
// @route   Post /recipes
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id;
        await Recipe.create(req.body);
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        res.render('error/404')
    }
});


// @desc    Show all recipes
// @route   Get /recipes
router.get('/', ensureAuth, async (req, res) => {
    try {
        const recipes = await Recipe.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()
        res.render('recipes/index', {
            recipes,
        })

    } catch (error) {
        console.log(error);
        res.render('error/404');
    }
});


// @desc    Show single recipe
// @route   GET /recipes/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let recipe = await Recipe.findById(req.params.id)
            .populate('user')
            .lean();

        if (!recipe) {
            return res.render('error/404')
        }

        res.render('recipes/recipe', {
            recipe
        });

    } catch (error) {
        console.log(error);
        res.render('error/500')
    }
});


// @desc    Show edit page
// @route   GET /recipes/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {

    try {
        const recipe = await Recipe.findOne({
            _id: req.params.id
        }).lean()
    
        if (!recipe) {
            return res.render('error/404');
        }
    
        if (recipe.user != req.user.id) {
            res.redirect('/recipes')
        } else {
            res.render('recipes/edit', {
                recipe,
            })
        }
    } catch (error) {
        console.log(error);
        return res.render('error/500')
    }
    
});


// @desc    Update recipe
// @route   PUT /recipes/:id
router.put('/:id', ensureAuth, async (req, res) => {
   try {
    let recipe = await Recipe.findById(req.params.id).lean()

    if (!recipe) {
        return res.render('error/404');
    }

    if (recipe.user != req.user.id) {
        res.redirect('/recipes')
    } else {
        recipe = await Recipe.findOneAndUpdate({
            _id: req.params.id,
        },
        req.body,{
            new: true,
            runValidators: true
        });

        res.redirect('/dashboard')
    }
   } catch (error) {
        console.log(error);  
        return res.render('error/500')
   }
});


// @desc    Delete recipe
// @route   DELETE /recipes/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Recipe.remove({_id: req.params.id})
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error);
        return rees.render('error/500')
    }
});


// @desc    User recipes
// @route   Get /recipes/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const recipes = await Recipe.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean();
        
        const _user = await User.findById(req.params.userId).lean()

        res.render('recipes/user', {
            recipes,
            _user
        });

    } catch (error) {
        console.log(error);
        res.render('error/500');
    }
});


module.exports = router