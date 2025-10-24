const express = require('express');
     const db = require('../config/database');
     const authenticate = require('../middleware/auth');

     const router = express.Router();

     router.get('/', authenticate, (req, res) => {
       db.all('SELECT * FROM products', (err, rows) => {
         if (err) return res.status(500).json({ error: err.message });
         res.json(rows);
       });
     });

     router.post('/', authenticate, (req, res) => {
       const { name, price, category, stock } = req.body;
       if (!name || !price || !category || stock == null) {
         return res.status(400).json({ error: 'All fields are required' });
       }
       db.run('INSERT INTO products (name, price, category, stock) VALUES (?, ?, ?, ?)',
         [name, price, category, stock],
         function(err) {
           if (err) return res.status(500).json({ error: err.message });
           res.json({ id: this.lastID });
         }
       );
     });

     module.exports = router;