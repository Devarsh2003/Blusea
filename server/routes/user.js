import express from "express";

import { getUsers, getUser } from "../controllers/user.js"
import { follow, accept, reject, cancel, unfollow } from "../controllers/follow.js";

const router = express.Router();

router.get("/",getUsers);
router.get("/:id",getUser);

// SEND_FOLLOW_REQUEST - ACCEPT_REQUEST - REJECT_REQUEST
router.put("/:userId/follow-request/:followId",follow);
router.put("/:userId/follow-request/:followId/accept",accept);
router.put("/:userId/follow-request/:followId/reject",reject);

// CANCEL_FOLLOW_REQUEST [ follower decided to cancel follow_request ( for a reason ) ]
// request already sent but now user want to cancel that request
router.put("/:userId/follow-request/:followId/cancel",cancel);

//UNFOLLOW
router.put("/:userId/unfollow/:followId",unfollow);

export default router;