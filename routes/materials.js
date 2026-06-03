const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM raw_material', (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

router.post('/', (req, res) => {
  const { name, unit, quantity, supplier_id, batch_number, manufacturing_date, expiry_date } = req.body;
  db.query(
    'INSERT INTO raw_material (name, unit, quantity, supplier_id, batch_number, manufacturing_date, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, unit, quantity, supplier_id, batch_number, manufacturing_date, expiry_date],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Material added successfully' });
    }
  );
});

router.put('/:id', (req, res) => {
  const { name, unit, quantity } = req.body;
  db.query(
    'UPDATE raw_material SET name=?, unit=?, quantity=? WHERE mat_id=?',
    [name, unit, quantity, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Material updated successfully' });
    }
  );
});

router.delete('/:id', (req, res) => {
  db.query(
    'DELETE FROM raw_material WHERE mat_id=?',
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Material deleted successfully' });
    }
  );
});

module.exports = router;