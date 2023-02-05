const express = require("express")

const authController2 = require("../controllers/authController2")

const router2 = express.Router()

//localhost:3000/
router2
    .route("/")
    .get(authController2.getAllUsers);
    //.post(authController2.createUser);

router2 
    .route("/:id")
    .get(authController2.getOneUser)
    .patch(authController2.updateUser)
    .delete(authController2.deleteUser);

module.exports = router2;


