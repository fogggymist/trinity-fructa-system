const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM finished_goods', (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

router.post('/', (req, res) => {
  const {
    product_name,
    batch_number,
    manufacturing_date,
    expiry_date,
    quantity,
    unit
  } = req.body;

  const query = `
    INSERT INTO finished_goods 
    (product_name, batch_number, manufacturing_date, expiry_date, quantity, unit, status)
    VALUES (?, ?, ?, ?, ?, ?, 'in stock')
  `;

  db.query(
    query,
    [product_name, batch_number, manufacturing_date, expiry_date, quantity, unit],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Product added successfully' });
    }
  );
});

router.put('/:id', (req, res) => {
  const { status } = req.body;

  db.query(
    'UPDATE finished_goods SET status = ? WHERE product_id = ?',
    [status, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Status updated successfully' });
    }
  );
});

router.put('/:id/dispatch', (req, res) => {
  const productId = req.params.id;

  const {
    dispatch_quantity,
    truck_number,
    driver_name,
    loadout_condition,
    dispatch_notes
  } = req.body;

  const qty = Number(dispatch_quantity);

  if (!qty || qty <= 0) {
    return res.status(400).json({ message: 'Invalid dispatch quantity' });
  }

  const checkQuery = 'SELECT quantity FROM finished_goods WHERE product_id = ?';

  db.query(checkQuery, [productId], (err, rows) => {
    if (err) return res.status(500).json(err);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const availableQty = Number(rows[0].quantity);

    if (qty > availableQty) {
      return res.status(400).json({
        message: `Only ${availableQty} units available`
      });
    }

    const newQty = availableQty - qty;
    const newStatus = newQty === 0 ? 'Dispatched' : 'in stock';

    const updateQuery = `
      UPDATE finished_goods
      SET quantity = ?, status = ?
      WHERE product_id = ?
    `;

    db.query(updateQuery, [newQty, newStatus, productId], (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: 'Finished product dispatched successfully',
        remaining_quantity: newQty,
        dispatch_details: {
          dispatch_quantity: qty,
          truck_number,
          driver_name,
          loadout_condition,
          dispatch_notes
        }
      });
    });
  });
});

router.delete('/:id', (req, res) => {
  db.query(
    'DELETE FROM finished_goods WHERE product_id = ?',
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Product deleted successfully' });
    }
  );
});

module.exports = router;