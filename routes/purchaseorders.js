const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
    db.query(
        'SELECT po.*, s.name AS supplier_name, r.name AS material_name FROM purchase_orders po LEFT JOIN supplier s ON po.supplier_id = s.supplier_id LEFT JOIN raw_material r ON po.mat_id = r.mat_id',
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
});

router.get('/pending', (req, res) => {
    db.query(
        'SELECT po.*, s.name AS supplier_name, r.name AS material_name FROM purchase_orders po LEFT JOIN supplier s ON po.supplier_id = s.supplier_id LEFT JOIN raw_material r ON po.mat_id = r.mat_id WHERE po.status = ?',
        ['ordered'],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
});

router.post('/', (req, res) => {
    const { supplier_id, mat_id, new_material_name, quantity_ordered, unit, expected_delivery, notes, batch_number, manufacturing_date, expiry_date } = req.body;
    db.query(
        'INSERT INTO purchase_orders (supplier_id, mat_id, new_material_name, quantity_ordered, unit, expected_delivery, notes, batch_number, manufacturing_date, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [supplier_id, mat_id || null, new_material_name || null, quantity_ordered, unit, expected_delivery, notes, batch_number || null, manufacturing_date || null, expiry_date || null],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Purchase order placed successfully' });
        }
    );
});

router.put('/:id/receive', (req, res) => {
    const order_id = req.params.id;

    db.query('SELECT * FROM purchase_orders WHERE order_id = ?', [order_id], (err, orders) => {
        if (err) return res.status(500).json(err);
        if (orders.length === 0) return res.status(404).json({ message: 'Order not found' });

        const order = orders[0];

        if (order.mat_id) {
            db.query(
                'UPDATE raw_material SET quantity = quantity + ?, batch_number = ?, manufacturing_date = ?, expiry_date = ? WHERE mat_id = ?',
                [order.quantity_ordered, order.batch_number, order.manufacturing_date, order.expiry_date, order.mat_id],
                (err) => {
                    if (err) return res.status(500).json(err);
                    markAsReceived(order_id, res);
                }
            );
        } else {
            db.query(
                'INSERT INTO raw_material (name, unit, quantity, supplier_id, batch_number, manufacturing_date, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [order.new_material_name, order.unit, order.quantity_ordered, order.supplier_id, order.batch_number, order.manufacturing_date, order.expiry_date],
                (err) => {
                    if (err) return res.status(500).json(err);
                    markAsReceived(order_id, res);
                }
            );
        }
    });
});

function markAsReceived(order_id, res) {
    db.query(
        'UPDATE purchase_orders SET status = ?, actual_delivery = CURDATE() WHERE order_id = ?',
        ['received', order_id],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Order received and stock updated successfully' });
        }
    );
}

router.put('/:id/cancel', (req, res) => {
    db.query(
        'UPDATE purchase_orders SET status = ? WHERE order_id = ?',
        ['cancelled', req.params.id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Order cancelled' });
        }
    );
});

module.exports = router;