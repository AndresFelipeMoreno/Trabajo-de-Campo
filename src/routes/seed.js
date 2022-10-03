const express = require('express');
const router = express.Router();

const pool = require('../database')
const { isLoggedIn }= require('../lib/auth');

router.get('/addseed', isLoggedIn, (req, res) => {
    res.render('seeds/addseed');
});

router.post('/addseed', isLoggedIn,  async (req, res) => {
    const { name , description, quantityAvailable, priceKg, cultivationTown } = req.body;
    const newSeed = {
        name,
        description,
        quantityAvailable,
        priceKg,
        cultivationTown,
        idUser: req.user.idUser
    };
    await pool.query('INSERT INTO seed set ?', [newSeed]);
    req.flash('success', 'Producto agregado correctamente');
    res.redirect('/seeds');
});

router.get('/', isLoggedIn,  async (req,res) => {
    const seeds = await pool.query('SELECT * FROM seed WHERE idUser = ?', [req.user.idUser])
    res.render('seeds/list', {seeds});
});

router.get('/delete/:idSeed', isLoggedIn , async (req,res) => {
    const {idSeed} = req.params;
    await pool.query('DELETE FROM seed WHERE idSeed = ?', [idSeed]);
    req.flash('success','Producto eliminado correctamente');
    res.redirect('/seeds');
});

router.get('/edit/:idSeed', isLoggedIn,  async (req, res) => {
    const {idSeed} = req.params;
    const seeds = await pool.query('SELECT * FROM seed WHERE idSeed = ?', [idSeed]);
    res.render('seeds/edit', {seed: seeds[0]})
});

router.post('/edit/:idSeed', isLoggedIn,  async (req, res) => {
    const { idSeed } = req.params;
    const { name,description,quantityAvailable,priceKg,cultivationTown} = req.body;
    const newSeed = {
        name,
        description,
        quantityAvailable,
        priceKg,
        cultivationTown
    };
    await pool.query('UPDATE seed SET ? WHERE idSeed = ?', [newSeed, idSeed]);
    req.flash('success','Producto actualizado correctamente');
    res.redirect('/seeds');
});

router.get('/singleItem/:idSeed', async (req, res) => {
    const { idSeed } = req.params;
    const sellers = await pool.query('SELECT * FROM users INNER JOIN seed ON users.idUser = seed.idUser WHERE idSeed = ?', [idSeed]);
    res.render('seeds/singleItem',{seller: sellers[0]});
});

module.exports = router;