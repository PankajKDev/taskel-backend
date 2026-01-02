const prisma = require("../utils/db");
const createTask = async (req, res) => {
  const { taskname, description, status = false } = req.body;
  try {
    const userId = req.user.id;
    console.log("DEBUG CHECK:", {
      comingFromBody: req.body,
      tasknameVar: taskname,
      userIdVar: userId,
    });
    const newTask = { name: taskname, status, description, ownerId: userId };
    const savedTask = await prisma.todo.create({ data: newTask });
    return res.status(200).send({ message: "created task" });
  } catch (e) {
    return res.status(400).send({ message: "invalid request", error: e });
  }
};

const getTasks = async (req, res) => {
  const userId = req.user.id;
  try {
    const tasks = await prisma.todo.findMany({
      where: { ownerId: userId },
    });
    return res
      .status(200)
      .send({ message: "tasks fetched successfully", data: tasks });
  } catch (error) {
    return res.status(500).send({ message: "Error fetching tasks", error });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { name, status, description } = req.body;

  const dataToUpdate = {
    name,
    status,
    description,
  };
  try {
    const updatedTask = await prisma.todo.updateMany({
      where: {
        id: id,
        ownerId: userId,
      },
      data: dataToUpdate,
    });
    return res
      .status(200)
      .send({ message: "successfully updated tasks", data: updatedTask });
  } catch (error) {
    return res.status(400).send({ message: "invalid request", error: error });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  const ownerId = req.user.id;
  try {
    const taskToDelete = await prisma.todo.deleteMany({
      where: { id: id, ownerId: ownerId },
    });

    if (taskToDelete.count === 0) {
      return res.status(404).send({
        message: "invalid request",
      });
    }
    return res
      .status(200)
      .send({ message: "successfully deleted task", data: taskToDelete });
  } catch (error) {
    const environment = process.env.NODE_ENV === "dev";
    return res.status(400).send({
      message: "unable to delete task",
      error: environment ? error : "contact website admin ",
    });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
