const express = require("express");
const router = express.Router();
const controller = require("../controller/UserController");
const TokenVerfy = require("../middleware/TokenVerify");

router.post("/createUser", controller.createUser);
router.post("/login", controller.login);
router.post("/profile", TokenVerfy, controller.profile);
// ------ post
router.post("/create/post", TokenVerfy, controller.createPost);
router.post("/getposts", TokenVerfy, controller.getpost);
router.delete("/delete/:id", TokenVerfy, controller.deletePost);
// ------ comment
router.post("/post/addcomment/:id", TokenVerfy, controller.addcomment);

module.exports = router;
