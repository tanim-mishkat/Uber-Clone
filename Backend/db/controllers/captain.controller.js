const { hash } = require('bcrypt');
const captainModel = require('../../models/captain.model.js');
const captainService = require('../../services/captain.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../../models/blacklistToken.model');

module.exports.registerCaptain = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    const isCaptainAlreadyExist = await captainModel.findOne({ email });

    if (isCaptainAlreadyExist) {
        return res.status(400).json({ message: 'Captain already exist' });
    }


    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        fullname: {
            firstname: fullname.firstname,
            lastname: fullname.lastname
        },
        email,
        password: hashedPassword,
        vehicle
    });


    const token = captain.generateAuthToken();


    res.status(201).json({ token, captain });

}

module.exports.loginCaptain = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');

    if (!captain) {
        return res.status(404).json({ error: "Invalid email or password" });
    }

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
        return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = await captain.generateAuthToken();

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000
    });
    await captainModel.findByIdAndUpdate(captain._id, { status: "active" });

    res.status(200).json({ captain, token });
};
module.exports.getCaptainProfile = async (req, res) => {
    res.status(200).json(req.captain);
};

module.exports.logoutCaptain = async (req, res) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    await blacklistTokenModel.create({ token });
    res.clearCookie('token');
    await captainModel.findByIdAndUpdate(req.captain._id, { status: "inactive", socketId: null });

    res.status(200).json({ message: "Logged out successfully" });
};