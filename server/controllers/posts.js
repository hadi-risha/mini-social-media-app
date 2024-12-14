import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async(req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},  //coz likes starts with 0
            comments: [],
        });

        await newPost.save();

        const post = await Post.find();  //return all posts, including new post
        res.status(201).json(post)
    } catch (err) {
        res.status(409).json({message: err.message});
    }
}

/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getUserPosts = async (req, res) => {
    try {
      const { userId } = req.params;
      const post = await Post.find({ userId });
      res.status(200).json(post);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
};

/* UPDATE */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);  //get - in Map, this method checks if the userId exists as a key
        if (isLiked) {
            post.likes.delete(userId); //delete - in Map, removing like(or userid) from already liked post,
        }else{
            post.likes.set(userId, true);  //userId is the key, true is the value 
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {likes: post.likes}, 
            { new: true }  //if do not specify this option or set it to false, Mongoose will return the og document before the update.
        );  //update list of likes that remodifined

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
};