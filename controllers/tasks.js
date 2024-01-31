const TaskSchema = require("../models/Task");

exports.addTask = async (req, res) => {
  try {
    const task = await TaskSchema(req.body).save();
    res.status(200).json({ task, message: "The task was added." });
  } catch (error) {
    res.send(error).status(500).json({ message: "Server error" });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await TaskSchema.find();
    res.status(200).json({ tasks, message: "This is your tasks list." });
  } catch (error) {
    res.send(error).status(500).json({ message: "Server error" });
  }
};

exports.editTask = async (req, res) => {
  try {
    const task = await TaskSchema.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ task, message: "The task was edited." });
  } catch (error) {
    res.status(500).json({ error, message: "Server error" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await TaskSchema.findByIdAndDelete(req.params.id);
    res.status(200).json({ task, message: "The task was deleted." });
  } catch (error) {
    res.send(error).status(500).json({ message: "Server error" });
  }
};
