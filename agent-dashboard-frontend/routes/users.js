const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");

// @route   GET api/users
// @desc    Get all users
// @access  Private (Agent only)
router.get("/", auth, userController.getAllUsers);

// @route   GET api/users/search
// @desc    Search users by query
// @access  Private (Agent only)
// ⚠️ IMPORTANT : Cette route doit être AVANT /:id
router.get("/search", auth, userController.searchUsers);

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Private (Agent only)
router.get("/:id", auth, userController.getUserById);

// @route   POST api/users
// @desc    Add new user (by agent)
// @access  Private (Agent only)
router.post("/", auth, userController.addUser);

// @route   PUT api/users/toggle-status/:id
// @desc    Toggle user active status (block/unblock)
// @access  Private (Agent only)
// ⚠️ IMPORTANT : Cette route doit être AVANT /:id
router.put("/toggle-status/:id", auth, userController.toggleUserStatus);

// @route   PUT api/users/:id
// @desc    Update user
// @access  Private (Agent only)
router.put("/:id", auth, userController.updateUser);

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Private (Agent only)
router.delete("/:id", auth, userController.deleteUser);

// @route   DELETE api/users/multiple
// @desc    Delete multiple users
// @access  Private (Agent only)
router.delete("/multiple", auth, userController.deleteMultipleUsers);

module.exports = router;

