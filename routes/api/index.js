const router = require("express").Router();
const userRoutes = require("./users");
const db = require("../../models");
const passport = require("../../config/passport-setup");

// User routes
router.use("/users", userRoutes);

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
      res.redirect(302, "/chat");
    })

});

router.post("/signup", function (req, res) {
  console.log('req.body= ' + req.body);
  db.User.create({
    email: req.body.email,
    username: req.body.username,
    avatarURL: req.body.avatarURL,
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