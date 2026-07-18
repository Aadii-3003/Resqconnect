const User = require('../models/User');

exports.searchDonors = async (req, res) => {
    try {
        const { bloodGroup, city, latitude, longitude } = req.query;

        // If searcher shared their location, use geospatial distance search
        if (latitude && longitude) {
            const pipeline = [
                {
                    $geoNear: {
                        near: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
                        distanceField: 'distance',
                        spherical: true,
                        query: { role: 'donor', isAvailable: true },
                    },
                },
            ];

            if (bloodGroup) pipeline.push({ $match: { bloodGroup } });
            if (city) pipeline.push({ $match: { city: new RegExp(city, 'i') } });

            pipeline.push({ $project: { password: 0 } });

            const donors = await User.aggregate(pipeline);
            // distance comes back in meters — convert to km
            const withKm = donors.map((d) => ({ ...d, distanceKm: (d.distance / 1000).toFixed(1) }));
            return res.json(withKm);
        }

        // Fallback: no location shared, use the original filter-only search
        const filter = { role: 'donor', isAvailable: true };
        if (bloodGroup) filter.bloodGroup = bloodGroup;
        if (city) filter.city = new RegExp(city, 'i');

        const donors = await User.find(filter).select('-password');
        res.json(donors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};