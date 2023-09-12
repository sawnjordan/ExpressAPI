const { z } = require("zod");
const UserModel = require("../auth/user.model");
class UserServices {
  getCount = async () => {
    try {
      return await UserModel.count();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  createUser = async (data) => {
    try {
      let user = new UserModel(data);
      return await user.save();
    } catch (error) {
      //   console.log("askldfsadflkjl");
      console.log(error);
      throw error;
    }
  };

  updateUser = async (id, data) => {
    try {
      return await UserModel.findByIdAndUpdate(id, { $set: data });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  deleteUserById = async (id) => {
    try {
      let response = await UserModel.findByIdAndDelete(id);
      if (!response) {
        throw { status: 400, msg: "User not found or already delete." };
      }
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  listUsers = async ({ perPage = 10, page = 1 }, filter = {}) => {
    try {
      // console.log(filter);
      let skip = (page - 1) * perPage;
      let data = await UserModel.find(filter)
        .sort({ _id: "desc" })
        .limit(perPage)
        .skip(skip);
      if (data) {
        return data;
      } else {
        throw { status: 404, msg: "No any user found." };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getUserById = async (id) => {
    try {
      let user = await UserModel.findById(id);
      if (!user) {
        throw { status: 404, msg: "User doesn't exists." };
      }
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getUserByFilter = async (filter = {}) => {
    try {
      return await UserModel.find(filter).sort({ _id: "desc" }).limit(10);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

const userServiceObj = new UserServices();
module.exports = userServiceObj;
