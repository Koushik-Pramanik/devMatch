const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require("../models/connecionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {

    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ['ignored','interested'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).send("Invalid status type: " + status);
        }

        const toUserExists = await User.findById(toUserId);
        if (!toUserExists) {
            return res.status(404).send("User not found");
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (existingConnectionRequest) {
            return res.status(400).send("Connection Request already exists");
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();

        res.json({
            message:req.user.firstName + " is" + status + "to connect with " + toUserExists.firstName,
            data
        });
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status , requestId} = req.params;

        const allowedStatus = ['accepted','rejected'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).send("Invalid status type: " + status);
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: 'interested'
        });

        if (!connectionRequest) {
            return res.status(404).send("Connection request not found");
        }

        connectionRequest.status = status;
        await connectionRequest.save();

        res.json({
            message: "Connection request " + status + " successfully",data: connectionRequest });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = requestRouter;