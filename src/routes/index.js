const express = require('express');
const router =  express.Router();
const pool = require('../database')

router.get('/',  async (req,res) => {
   const allSeeds = await pool.query('SELECT * FROM seed')
   res.render('mainPage', {allSeeds});
});

module.exports = router;