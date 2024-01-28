const express = require("express");
const router = express.Router();
const validationRequest = require("../middleware/validationRequest");
const listController = new (require("../controllers/ListController"))();

router.get("/all", validationRequest, listController.getAll);

router.delete("/delete/:id", validationRequest, listController.deleteOne);

router.post("/create", validationRequest, listController.create);

router.get("/:id", validationRequest, listController.findOne);

router.patch("/:id", validationRequest, listController.updateOne);

module.exports = router;
