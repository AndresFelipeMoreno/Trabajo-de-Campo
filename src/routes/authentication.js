const express = require('express');
const router = express.Router();
const pool = require('../database');
const passport = require('passport');
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');
const { query } = require('express');


router.get('/signin', isNotLoggedIn, (req, res) => {
  res.render('auth/signin');
  });

router.post('/signin', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local.signin',{
    successRedirect:'/profile',
    failureRedirect :'/signin',
    failureFlash: true
  })(req,res,next);
});

router.get('/signup', isNotLoggedIn, (req, res) =>{
  res.render('auth/signup');
});

router.get('/searchLog',isLoggedIn, async (req, res) =>{
  let {name} = req.query;
  const searchSeedsLog = await pool.query('SELECT * FROM seed WHERE name = ? AND idUser = ?', [name, req.user.idUser]);
  res.render('auth/searchLog', {searchSeedsLog});
});

router.get('/search', isNotLoggedIn, async (req, res) =>{
  let {name} = req.query;
  const searchSeeds = await pool.query('SELECT * FROM seed WHERE name = ?', [name]);
  res.render('auth/search', {searchSeeds});
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));


router.get('/profile', isLoggedIn, (req,res) =>{
  res.render('profile');
});


router.get("/logout", (req, res, next) => {
  req.logOut(req.user, err => {
      if(err) return next(err);
      res.redirect("/profile");
  });
});

router.get('/search', (req,res) =>{

  res.render('auth/search');
});

module.exports = router;