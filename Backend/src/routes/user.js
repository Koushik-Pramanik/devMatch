const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connecionRequest");
const User = require("../models/user");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId', ['firstName', 'lastName', 'photoUrl', 'skills', 'age', 'gender']);

        res.json({
            message: "User profile fetched successfully",
            data: connectionRequests
        });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: 'accepted' },
                { toUserId: loggedInUser._id, status: 'accepted' }
            ]
        }).populate('fromUserId toUserId', ['firstName', 'lastName', 'photoUrl', 'skills', 'age', 'gender']);
        

        const data = connections.map((row) => {
            const isLoggedInUserSender =
                row.fromUserId._id.toString() === loggedInUser._id.toString();

            return isLoggedInUserSender ? row.toUserId : row.fromUserId;
        });

        res.json({
            message: "User connections fetched successfully",
            data
        });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 100 ? 100 : limit; // Limit the maximum number of users per page to 100
        const skip = (page - 1) * limit;

        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id}, { toUserId: loggedInUser._id}
            ]
        }).select('fromUserId toUserId');

        const hideUserFromFeed = new Set();
        connections.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        });

        const feedUsers = await User.find({
            $and: [{_id: { $nin: Array.from(hideUserFromFeed) }},
                {_id: {$ne: loggedInUser._id}}
            ]
        }).select('firstName lastName photoUrl skills age gender').skip(skip).limit(limit);

        res.send(feedUsers);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = userRouter; 
