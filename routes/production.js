const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
    db.query(
        'SELECT p.*, r.name AS material_name FROM production p LEFT JOIN raw_material r ON p.mat_id = r.mat_id',
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
});

router.post('/', (req, res) => {
    const { mat_id, quantity_requested, date, status } = req.body;

    db.query(
        'INSERT INTO production (mat_id, quantity_requested, date, status) VALUES (?, ?, ?, ?)',
        [mat_id, quantity_requested, date, status || 'pending'],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Production request added successfully' });
        }
    );
});

router.put('/:id/approve', (req, res) => {
    db.query(
        'UPDATE production SET status=? WHERE request_id=?',
        ['approved', req.params.id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Production request approved successfully' });
        }
    );
});

router.put('/:id', (req, res) => {
    const { status } = req.body;

    db.query(
        'UPDATE production SET status=? WHERE request_id=?',
        [status, req.params.id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Request status updated successfully' });
        }
    );
});

router.put('/:id/dispatch', (req, res) => {
    const { truck_number, driver_name, loadout_condition, dispatch_notes } = req.body;

    db.query(
        'UPDATE production SET status=?, truck_number=?, driver_name=?, loadout_condition=?, dispatch_notes=?, dispatch_date=CURDATE() WHERE request_id=?',
        ['dispatched', truck_number, driver_name, loadout_condition, dispatch_notes, req.params.id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Dispatched successfully' });
        }
    );
});

module.exports = router;