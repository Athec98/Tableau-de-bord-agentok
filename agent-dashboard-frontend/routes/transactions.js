const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const transactionController = require("../controllers/transactionController");

// @route   POST api/transactions/deposit
// @desc    Create a new deposit transaction
// @access  Private (Agent only)
router.post("/deposit", auth, transactionController.createDeposit);

// @route   GET api/transactions
// @desc    Get all transactions
// @access  Private (Agent only)
router.get("/", auth, transactionController.getAllTransactions);

// @route   GET api/transactions/search
// @desc    Search transactions by query
// @access  Private (Agent only)
router.get("/search", auth, transactionController.searchTransactions);

// @route   PUT api/transactions/cancel/:id
// @desc    Cancel a transaction
// @access  Private (Agent only)
router.put("/cancel/:id", auth, transactionController.cancelTransaction);

// @route   PUT api/transactions/block/:id
// @desc    Block a transaction
// @access  Private (Agent only)
router.put("/block/:id", auth, transactionController.blockTransaction);

// @route   DELETE api/transactions/:id
// @desc    Delete a transaction
// @access  Private (Agent only)
router.delete("/:id", auth, transactionController.deleteTransaction);

// @route   GET api/transactions/history
// @desc    Get all transactions history
// @access  Private (Agent only)
router.get("/history", auth, transactionController.getTransactionsHistory);

module.exports = router;

