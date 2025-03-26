const { Sequelize } = require("sequelize");

const TodoModel = require("../models").Todo;

const createTodo = async (req, res) => {
  const user_id = req.sub;
  const { text, date } = req.body;
  await TodoModel.create({
    text: text,
    date: date,
    completed: false,
    user_id: user_id,
  })
    .then((result) => {
      return res.status(201).json(result);
    })
    .catch((error) => {
      console.error("ADD TODO: ", error);
      return res.status(500);
    });
};

const getAllTodo = async (req, res) => {
  const user_id = req.sub;
  await TodoModel.findAll({
    where: { user_id: user_id },
    order: [["date", "ASC"]],
    attributes: { exclude: ["user_id"] },
  })
    .then((result) => {
      if (result) {
        return res.status(200).json(result);
      } else {
        return res.status(404);
      }
    })
    .catch((error) => {
      console.error("GET ALL TODO: ", error);
      return res.status(500);
    });
};

const editTodo = async (req, res) => {
  const user_id = req.sub;
  const query = { id: req.params.id, user_id: user_id };
  const data = req.body;
  const todo = await TodoModel.findOne({ where: query });
  if (todo) {
    console.log(todo);
    todo.completed = data.completed ? data.completed : false;
    if (data.text !== "") data.text;
    if (data.date !== "") data.date;
    await todo
      .save()
      .then(() => {
        return res.status(200).json(todo);
      })
      .catch((error) => {
        console.error("UPDATE TODO: ", error);
        return res.status(500);
      });
  } else {
    return res.status(404);
  }
};

const deleteTodo = (req, res) => {
  const user_id = req.sub;
  const todo_id = req.params.id;
  const query = { id: todo_id, user_id: user_id };
  TodoModel.destroy({
    where: query,
  })
    .then(() => {
      return res.status(200).json({ id: todo_id });
    })
    .catch((error) => {
      console.error("DELETE TODO: ", error);
      return res.status(500);
    });
};

const getSearchTodo = async (req, res) => {
  const user_id = req.sub;
  const query = req.query.q;
  await TodoModel.findAll({
    where: [
      {
        user_id: user_id,
      },
      Sequelize.literal(`MATCH (text) AGAINST ('*${query}*' IN BOOLEAN MODE)`),
    ],
    order: [["date", "ASC"]],
    attributes: { exclude: ["user_id"] },
  })
    .then((result) => {
      if (result) {
        return res.status(200).json(result);
      } else {
        return res.status(404);
      }
    })
    .catch((error) => {
      console.error("SEARCH TODO: ", error);
      return res.status(500);
    });
};

module.exports = { createTodo, getAllTodo, getSearchTodo, editTodo, deleteTodo };
