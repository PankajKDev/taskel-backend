const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/task.controller");

router.post("/create", createTask);
router.get("/get-tasks", getTasks);
router.patch("/update-task/:id", updateTask);
router.delete("/delete-task/:id", deleteTask);
module.exports = router;
