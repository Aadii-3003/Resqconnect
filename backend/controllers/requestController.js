const Request = require('../models/Request');

exports.createRequest = async (req, res) => {
    try {
        const { bloodGroup, hospitalName, city, urgency } = req.body;
        const request = await Request.create({
            requestedBy: req.user.id,
            bloodGroup,
            hospitalName,
            city,
            urgency,
        });

        const populated = await request.populate('requestedBy', 'name email');

        const io = req.app.get('io');
        io.emit('newRequest', populated); // broadcast to everyone connected

        res.status(201).json(request);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getRequests = async (req, res) => {
    try {
        const requests = await Request.find().populate('requestedBy', 'name email').sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const request = await Request.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!request) return res.status(404).json({ message: 'Request not found' });
        res.json(request);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getMyRequests = async (req, res) => {
    try {
        const requests = await Request.find({ requestedBy: req.user.id }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};