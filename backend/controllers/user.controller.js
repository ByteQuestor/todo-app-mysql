const bcrypt = require('bcrypt');
const UserModel = require('../models').User;

const cleanUser = (user) => {
  // eslint-disable-next-line no-unused-vars
  const { password, ...cleanedUser } = user.get({ plain: true });
  return cleanedUser;
};

const createUser = async (req, res) => {
  // Call the create function on the User model, and pass the data that you receive.

  const { email, password } = req.body;
  await UserModel.create({
    email: email.toLowerCase(),
    password: await bcrypt.hash(password, 8)
  })
    .then((result) => {
      return res.status(201).json(cleanUser(result));
    })
    .catch((error) => {
      console.error('ADD USER: ', error);
      if (error && error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          message: 'Un compte avec cet email exist déjà !'
        });
      } else {
        return res.status(500);
      }
    });
};

const getUser = async (req, res) => {
  const user_id = req.sub;
  await UserModel.findOne({
    where: { id: user_id },
    attributes: { exclude: ['id', 'password'] }
  })
    .then((result) => {
      if (result) {
        return res.status(200).json(result);
      } else {
        return res.status(404);
      }
    })
    .catch((error) => {
      console.error('GET USER: ', error);
      return res.status(500);
    });
};

const editUser = async (req, res) => {
  const user_id = req.sub;
  const query = { id: user_id };
  const data = req.body;
  const user = await UserModel.findOne({ where: query });
  if (user) {
    user.name = data.name ? data.name : null;
    user.address = data.address ? data.address : null;
    user.zip = data.zip ? data.zip : null;
    user.location = data.location ? data.location : null;
    await user
      .save()
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((error) => {
        console.error('UPDATE USER: ', error);
        return res.status(500);
      });
  } else {
    return res.status(404);
  }
};

const deleteCurrentUser = (req, res) => {
  const user_id = req.sub;
  const query = { id: user_id };
  UserModel.destroy({
    where: query
  })
    .then(() => {
      return res.status(200).json({ id: user_id });
    })
    .catch((error) => {
      console.error('DELETE USER: ', error);
      return res.status(500);
    });
};

module.exports = { createUser, getUser, editUser, deleteCurrentUser };
