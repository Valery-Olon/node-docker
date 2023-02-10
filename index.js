const express = require("express")
const mongoose = require('mongoose');
const session = require("express-session");
const redis = require("redis");
const RedisStore = require("connect-redis") (session);
const cors = require("cors");

const { 
    MONGO_USER, 
    MONGO_PASSWORD, 
    MONGO_IP, 
    MONGO_PORT,
    REDIS_URL,
    REDIS_PORT,
    SESSION_SECRET,
 } = require("./config/config");

let redisClient =redis.createClient({
    legacyMode: true,                   // use legacy to have the Store working
    socket: {                           // redis > 4.5, use "socket" to avoid ECONREFUSE connectin erro  
        host: REDIS_URL,
        port: REDIS_PORT,

    }
    
});


mongoose.set('strictQuery', true);


// assess redis client connection
(async () => {
    await redisClient.connect();
})();

redisClient.on("connect", () => {
    console.log("redis client connected");
    console.log("Session secret = ", SESSION_SECRET);
})
redisClient.on('error', (err) => {
    console.log("redis client error = ", err);
})

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");
const userRouter2 = require("./routes/userRoutes2");

const app = express()
const mongoURL=`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
    mongoose
    .connect(mongoURL)                      // useFindAndModify etc. are deprecated since mongoose v 6.x
    .then(() => console.log("succesfully connected to DB"))
    .catch((e) => {
        console.log(e);
        setTimeout(connectWithRetry, 5000);
    });

}

connectWithRetry();

app.enable("trust proxy");

app.use(cors({}));      // CORS allows the frontend to run on a domain different from the "api" backend domain

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: "secret", //SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        hhtpOnly: true,
        maxAge: 60000,
    }
}));

app.use(express.json());

// app.get("/", (req, res) => {          // all frontend requests to non-"/api/v1"
app.get("/api/v1", (req, res) => {       // all backend request to "/api/v1"
    res.send("<h2>Hi There, Paul</h2>");
    console.log("yeah it ran")
}); 

// CORS allows the frontend to run on a domain different from the "api" backend domain
// by default the "api" will reject the request from the frontend different domain
// www.google.com (frontend hosted at google) --> send requests to --> www.yahoo.com (backend api exist)
// "api" on backend will reject request from front end because they are 2 different domains.


//localhost:3000/api/v1/               
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/users2", userRouter2);


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listenig on port ${port}`))
