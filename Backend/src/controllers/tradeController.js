const Trade = require('../models/Trade');

exports.getTrades = async (req, res) => {
    try {

        let trades;

        if (req.user.role === 'admin') {
            trades = await Trade.find().populate('user', 'username email');
        } else {
            trades = await Trade.find({ user: req.user.id });
        }

        res.status(200).json(trades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createTrade = async (req, res) => {
    try {

        const { symbol, entryPrice, targetPrice, notes } = req.body;

        if (!symbol || !entryPrice) {
            return res.status(400).json({ message: 'Symbol and Entry Price are required' });
        }

        const trade = await Trade.create({
            user: req.user.id,
            symbol,
            entryPrice,
            targetPrice,
            notes,
        });

        res.status(201).json(trade);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTrade = async (req, res) => {
    try {

        const trade = await Trade.findById(req.params.id);

        if (!trade) {
            return res.status(404).json({ message: 'Trade not found' });
        }

        if (trade.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You do not have permission to update this trade' });
        }

        const updatedtrade = await Trade.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json(updatedtrade);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteTrade = async (req, res) => {
    try {

        const trade = await Trade.findById(req.params.id);

        if (!trade) {
            return res.status(404).json({ message: 'Trade not found' });
        }

        if (trade.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You do not have permission to delete this trade' });
        }

        await trade.deleteOne();

        res.status(200).json({ id: req.params.id, message: 'Trade deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}