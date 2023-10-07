const slugify = require("slugify");
const UserModel = require("../auth/user.model");
const userServiceObj = require("./user.services");
// require("slugify");

class UserController {
  getAllUsers = async (req, res, next) => {
    try {
      let filter = {};
      if (req.query.type) {
        filter = {
          role: req.query.type,
        };
      }
      // console.log(filter);
      let { perPage, page } = req.query;
      let pagination = { perPage: parseInt(perPage), page: parseInt(page) };
      let data = await userServiceObj.listUsers(pagination, filter);
      let userCount = await userServiceObj.getCount();
      res.json({
        data: data,
        status: true,
        msg: "User Fetched.",
        meta: {
          totalCount: userCount,
          ...pagination,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  updateUser = async (req, res, next) => {
    try {
      let userId = req.params.id;
      let user = await userServiceObj.getUserById(userId);
      let data = req.body;
      if (req.file) {
        data.image = req.file.filename;
      } else {
        data.image = user.image;
      }

      let validUserData = userServiceObj.validateUserUpdateData(data);
      let updatedUser = await userServiceObj.updateUser(userId, validUserData);

      if (updatedUser) {
        res.json({
          data: updatedUser,
          status: true,
          msg: "User Updated Successfully.",
          meta: null,
        });
      } else {
        throw { status: 400, msg: "Failed to update a user." };
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  updateMe = async (req, res, next) => {
    try {
      let data = req.body;
      const userId = req.authUser._id;
      if (req.file) {
        data.image = req.file.filename;
      }

      let validUserData = userServiceObj.validateUserUpdateData(data);
      let updatedUser = await userServiceObj.updateUser(userId, validUserData);

      if (updatedUser) {
        res.json({
          data: updatedUser,
          status: true,
          msg: "User Updated Successfully.",
          meta: null,
        });
      } else {
        throw { status: 400, msg: "Failed to update a user." };
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  deleteUser = async (req, res, next) => {
    try {
      const userId = req.params.id;
      let del = await userServiceObj.deleteUserById(userId);
      res.json({
        data: del,
        status: true,
        msg: "User Deleted Successfully",
        meta: null,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getUserById = async (req, res, next) => {
    try {
      const userId = req.params.id;
      let user = await userServiceObj.getUserById(userId);
      res.json({
        data: user,
        status: true,
        msg: "User Fetched Successfully",
        meta: null,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
const userControllerObj = new UserController();
module.exports = userControllerObj;
