const router = require("express").Router();
const userRoutes = require("./users");
const messageRoutes = require("./messages");
const privateMessageRoutes = require("./privateMessages");
const db = require("../../models");
const passport = require("../../config/passport-setup");

// User routes, Message routes, privateMessage routes
router.use("/users", userRoutes);
router.use("/messages", messageRoutes);
router.use("/privateMessages", privateMessageRoutes);

// Route to log a user in
router.post("/login", passport.authenticate("local"), function (req, res) {
  console.log("Back in the redirect!");
  console.log("Req.user is ", req.user);
  console.log("logged in as: ", req.user.email);
  console.log(req.session);
  db.User.findOneAndUpdate({
    email: req.user.email
  },
    {
      $set: { "online": true }
    },
    {
      returnNewDocument: true
    }).then(function () {
      res.status(200).send("user authenticated!");
    })

});

router.post("/signup", function (req, res) {
  console.log('req.body= ' + req.body);
  db.User.create({
    email: req.body.email,
    username: req.body.username,
    avatarURL: req.body.avatarURL,
    colorSeed: req.body.colorSeed,
    password: req.body.password
  }).then(function () {
    res.redirect(307, "/api/login");
  }).catch(function (err) {
    console.log(err);
    res.json(err);
  });
});

// Route for logging user out
router.get("/logout", function (req, res) {
  db.User.findOneAndUpdate({
    email: req.user.email
  },
    {
      $set: { "online": false }
    },
    {
      returnNewDocument: true
    }).then(function () {
      req.logout();
      res.redirect("/");
    })
  console.log("Req.user is ", req.user);
});

module.exports = router;