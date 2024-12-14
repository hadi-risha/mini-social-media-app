import jwt from "jsonwebtoken";

/* MIDDLEWARE */
export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization"); //grabing token for verification, these where token(in auth header) set in frontend
        
        if (!token) {
            return res.status(403).send("Access Denied");
        }

        if(token.startsWith("Bearer ")){  //to get the real token val
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;  //attach info to request
        next();

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}