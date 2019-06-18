const router = require("express").Router();
const privateMessagesController = require("../../controllers/privateMessagesController");

// Matches with "/api/privatemessages"
router
  .route("/")
  .get(privateMessagesController.findAll)
  .post(privateMessagesController.create)
  .delete(privateMessagesController.remove);

// Matches with "/api/privatemessages/:id"
router
  .route("/:id")
  .get(privateMessagesController.findOne)
  .put(privateMessagesController.update);

module.exports = router;