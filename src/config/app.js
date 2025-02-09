const express = require("express");
const router = require("../routes");
const cookieParser = require("cookie-parser");
const mongodbInit = require("./mongo.config");
const cors = require("cors");
const path = require("path");
// const { TokenExpiredError } = require("jsonwebtoken");
const __dirname1 = path.resolve();
const app = express();
mongodbInit();

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Enable credentials (cookies, authorization headers)
};
// const corsOptions = {
//   origin: "http://localhost:5173/",
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true, // Enable credentials (cookies, authorization headers)
// };
app.use(cors(corsOptions));

// const allowedOrigins = [
//   "https://mern-frontend-drab.vercel.app",
//   "http://localhost:5173",
// ];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true, // Enable credentials (cookies, authorization headers)
// };

app.use(cors(corsOptions));

// const allowedOrigins = [
//   "https://mern-frontend-sand.vercel.app/",
//   "http://localhost:5173/",
// ];
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true, // Allow credentials
//   })
// );

//if your content type is application/json us this middleware
app.use(express.json());

//if your content type is application/x-www-from-urlencoded
app.use(express.urlencoded({ extended: false }));

//to use cookie
app.use(cookieParser());

// UI Test
app.get("/", (req, res) => {
  res.send("Api is working perfectly fine");
});

app.use("/api/v1", router);

// app.use("/assets", express.static(process.cwd() + "/public/uploads"));
app.use("/assets", express.static(path.join(__dirname1, "/public/uploads")));
//this is express global error handling middleware. The first parameter is always err.
app.use((err, req, res, next) => {
  console.log(err);
  if (err.name === "ValidationError") {
    const validationErrors = err.errors;

    const formattedErrors = {};
    for (let field in validationErrors) {
      formattedErrors[field] = {
        message: validationErrors[field].message,
        path: validationErrors[field].path,
      };
    }

    res.status(400).json({
      error: formattedErrors,
      msg: err._message,
    });
  }

  if (err.code === 11000 && err.keyPattern && err.keyValue) {
    const fieldName = Object.keys(err.keyPattern)[0];
    const fieldValue = err.keyValue[fieldName];

    res.status(400).json({
      error: `Duplicate value '${fieldValue}' for field '${fieldName}.'`,
    });
  }

  if (err.name === "CastError") {
    return res.status(401).json({
      status: 401,
      // err: err,
      msg: `Invalid value ${err.value} for field: ${err.path}`,
    });
  }

  // if (err instanceof TokenExpiredError) {
  //   return res.status(401).json({
  //     status: 401,
  //     msg: "Token Expired.",
  //   });
  // }

  let statusCode = err.status || 500;
  let msg = err.msg || "Internal Server Error.";
  res.status(statusCode).json({ data: null, msg: msg, meta: null });
});

module.exports = app;
