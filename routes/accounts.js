const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM accounts', (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

router.post('/', (req, res) => {
  const { mat_id, invoice_no, price } = req.body;
  db.query(
    'INSERT INTO accounts (mat_id, invoice_no, price) VALUES (?, ?, ?)',
    [mat_id, invoice_no, price],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Account record added successfully' });
    }
  );
});

router.put('/:id', (req, res) => {
  const { invoice_no, price } = req.body;
  db.query(
    'UPDATE accounts SET invoice_no=?, price=? WHERE account_id=?',
    [invoice_no, price, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Account record updated successfully' });
    }
  );
});

router.delete('/:id', (req, res) => {
  db.query(
    'DELETE FROM accounts WHERE account_id=?',
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Record deleted successfully' });
    }
  );
});

module.exports = router;