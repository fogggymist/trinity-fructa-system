const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM supplier', (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

router.post('/', (req, res) => {
    const { name, contact, address } = req.body;
    db.query(
        'INSERT INTO supplier (name, contact, address) VALUES (?, ?, ?)',
        [name, contact, address],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Supplier added successfully' });
        }
    );
});

router.delete('/:id', (req, res) => {
    db.query(
        'DELETE FROM supplier WHERE supplier_id=?',
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Supplier deleted successfully' });
        }
    );
});

module.exports = router;