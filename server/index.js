import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";   // builtin. to properly set the path when configure dir
import { fileURLToPath } from "url"; // to properly set the path when configure dir
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

  /* configurations(middleware, package) */
  const __filename = fileURLToPath(import.meta.url);  //to grab file url(only set when using the module in json, impo inst req, we need this confi for that setup)
  const __dirname = path.dirname(__filename);
  dotenv.config();
  const app = express();
  app.use(express.json());
  app.use(helmet());   //for req safety
  app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
  app.use(morgan('common'));
  app.use(bodyParser.json({ limit: "30mb", extended: true }));  //maximum size of the JSON payload
  //true: Allows for parsing of more complex data structures, like nested objects, using the qs library.
  //false: Uses the querystring library, which supports only simple key-value pairs
  app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

  app.use(cors());
  app.use("/assets", express.static(path.join(__dirname, 'public/assets')));  //in other proj, dir or cloud storage like s3


  /* FILE STORAGE */
  const storage = multer.diskStorage({
    destination: function(req, file, cb){  //file: The uploaded file object.
      cb(null, "public/assets");   // set the destination folder (of multer) where files will be stored, Callback function to specify the storage location
    },
    filename: function (req, file, cb){ //file: The file object representing the uploaded file. This includes properties like originalname
      cb(null, file.originalname)  //Callback function to specify the filename. uploaded file is saved using its original name
    }
  });

  const upload = multer({ storage });

  /* ROUTES WITH FILES */
  app.post("/auth/register", upload.single("picture"), register);  //picture - field name
  app.post("/posts", verifyToken, upload.single("picture"), createPost)

  /* ROUTES */
  app.use("/auth", authRoutes);
  app.use("/users", userRoutes);
  app.use("/posts", postRoutes);


  /* MONGOOSE SETUP */
  const PORT = process.env.PORT || 6001;
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,   //This tells mongoose to use a new way to understand the MongoDB connection string (URL).
    useUnifiedTopology: true,
  }).then(() => {
    app.listen(PORT, ()=> console.log(`Server running at: http://localhost:${PORT}`));
    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  }).catch((error) => console.log(`${error} did not connect`)
  )


  //hadirisha02@gmail.com - used for mongodb
  //npm start


