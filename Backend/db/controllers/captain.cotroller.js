const { hash } = require('bcrypt');
const captainModel = require('../../models/captain.model');
const captainService = require('../../services/captain.service');
const { validationResult } = require('express-validator');

module.exports.registerCaptain = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { fullname, email, password, vehicle } = req.body;

    const isCaptainAlreadtRegistered = await captainModel.findOne({ email });
    if (isCaptainAlreadtRegistered) {
        return res.status(400).json({ error: "Captain already registered" });
    }
    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain(
        fullname.firstname,
        fullname.lastname,
        email,
        hashedPassword,
        vehicle.color,
        vehicle.plate,
        vehicle.capacity,
        vehicle.vehicleType
    );
    const token = await captain.generateAuthToken();
    res.status(201).json({ captain, token });
};
