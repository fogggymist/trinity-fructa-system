const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM reports', (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

router.get('/stock', (req, res) => {
  db.query(
    'SELECT r.name, r.unit, r.quantity, r.expiry_date, s.name AS supplier FROM raw_material r LEFT JOIN supplier s ON r.supplier_id = s.supplier_id',
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

router.get('/lowstock', (req, res) => {
  db.query(
    'SELECT * FROM raw_material WHERE quantity < 10',
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

router.get('/production', (req, res) => {
  db.query(
    'SELECT p.request_id, r.name AS material, p.quantity_requested, p.date, p.status FROM production p LEFT JOIN raw_material r ON p.mat_id = r.mat_id',
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

router.post('/', (req, res) => {
  const { report_type, generated_by } = req.body;
  db.query(
    'INSERT INTO reports (report_type, generated_date, generated_by) VALUES (?, CURDATE(), ?)',
    [report_type, generated_by],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Report generated successfully' });
    }
  );
});

module.exports = router;