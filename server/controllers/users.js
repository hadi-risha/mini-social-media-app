import { log } from "node:console";
import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      res.status(200).json(user);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
};

export const getUserFriends = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
  
      const friends = await Promise.all(    //all-> to find all frnds data. get friends full details
        user.friends.map((id) => User.findById(id))
      );
      const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
          return { _id, firstName, lastName, occupation, location, picturePath };
        }
      );
      res.status(200).json(formattedFriends);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
};


/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        console.log("id, friendId", id, friendId);
        
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!friend) {
          return res.status(404).json({ message: "Friend not found" });
        }

        console.log("user, friend...",user, friend);
        console.log("add/remove friend section....");

        // removing friend from user freiends list and reassign the remaining friends list to  user.friends 
        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            //if the friend not in user friends list, then add to friends list
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        // fetch updated friends details
        const friends = await Promise.all( //all-> to find all frnds data. get friends full details
            user.friends.map( (id) => User.findById(id))
        );

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
              return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        console.log("formattedFriends",formattedFriends);
        res.status(200).json(formattedFriends);
        
    } catch (err) {
        console.error("Error in add/remove friend(server): ", err);
        res.status(500).json({ message: err.message }) 
    }
};