import express from "express";
import { getFeedPosts,getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();  //method creates a new router object. A router behaves like a mini Express app that can have its own routing logic

/* READ */
router.get("/", verifyToken, getFeedPosts);  //home page posts, all posts
router.get("/:userId/posts", verifyToken, getUserPosts);   //user's posts

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);


export default router;



























