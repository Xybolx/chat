const router = require("express").Router();
const privateMessagesController = require("../../controllers/privateMessagesController");

// Matches with "/api/privatemessages"
router
  .route("/")
  .get(privateMessagesController.findAll)
  .post(privateMessagesController.create);

// Matches with "/api/privatemessages/:id"
router
  .route("/:id")
  .get(privateMessagesController.findOne)
  .put(privateMessagesController.update)
  .delete(privateMessagesController.remove);

module.exports = router;