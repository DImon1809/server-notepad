const express = require("express");
const router = express.Router();

const authController = new (require("../controllers/AuthController"))();
const validationRequest = require("../middleware/validationRequest");

const checkValid = require("../validations/checkValid");

router.get("/refresh", validationRequest, authController.refresh);

router.post("/register", checkValid, authController.register);

router.post("/confirm", authController.confirm);

router.post("/repeat", authController.repeat);

router.post("/login", checkValid, authController.login);

module.exports = router;
