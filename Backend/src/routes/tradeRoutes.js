const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getTrades, createTrade, updateTrade, deleteTrade } = require('../controllers/tradeController');

router.route('/')
    .get(protect, getTrades)
    .post(protect, createTrade);

router.route('/:id')
    .put(protect, updateTrade)
    .delete(protect, deleteTrade);

module.exports = router;

