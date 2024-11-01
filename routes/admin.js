const { Router } = require("express");
const jwt = require("jsonwebtoken");
const adminMiddleware = require("../middleware/admin");
const { Admin, User, Course } = require("../db");
const { JWT_SECRET } = require("../config");
const router = Router();

// Admin Routes
router.post("/signup", (req, res) => {
  // Implement admin signup logic
  const username = req.body.username;
  const password = req.body.password;

  //check if a user with this username already exists
  Admin.create({
    username: username,
    password: password, // if key is same as variable no need to write it as a pair
  }).then(function () {
    res.json({
      message: "Admin created successfully",
    });
  });
});

router.post("/signin", async (req, res) => {
  // Implement admin signup logic
  const username = req.body.username;
  const password = req.body.password;

  const user = await Admin.find({
    username,
    password,
  });

  if (user) {
    const token = jwt.sign(
      {
        username,
      },
      JWT_SECRET
    );

    res.json({
      token,
    });
  } else {
    res.status(411).json({
      message: "Incorrect email and password",
    });
  }
});

router.post("/courses", adminMiddleware, (req, res) => {
  // Implement course creation logic
  const title = req.body.title;
  const description = req.body.description;
  const imageLink = req.body.imageLink;
  const price = req.body.price;

  Course.create({
    title,
    description,
    imageLink,
    price,
  }).then(function (newcourse) {
    res.json({
      message: "Course created successfully",
      courseId: newcourse._id,
    });
  });
});

router.get("/courses", adminMiddleware, (req, res) => {
  // Implement fetching all courses logic
  Course.find({}).then(function (abc) {
    res.json({
      courses: abc,
    });
  });
});

module.exports = router;
