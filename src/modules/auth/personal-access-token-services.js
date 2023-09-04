const PersonalAccessTokenModel = require("./access.token.model");

class PersonalAccessTokenService {
  storeInDB = async (patData) => {
    try {
      let personalAccessToken = new PersonalAccessTokenModel(patData);
      return personalAccessToken.save();
    } catch (error) {
      console.log(error);
      throw { status: 400, msg: "Can't store the personal access token." };
    }
  };

  updateAccessToken = async (data, patId) => {
    try {
      let updateData = await PersonalAccessTokenModel.findByIdAndUpdate(
        patId,
        {
          $set: data,
        },
        { new: true }
      );
      return updateData;
    } catch (error) {
      console.log(error);
      throw { status: 400, msg: "Error updating the access token." };
    }
  };

  getPATFromToken = async (token) => {
    try {
      let data = await PersonalAccessTokenModel.findOne({
        $or: [{ accessToken: token }, { refreshToken: token }],
      });
      if (data) {
        return data;
      } else {
        throw { status: 401, msg: "Token Query Error / No PAT found." };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  deletePAT = async (token) => {
    try {
      let response = await PersonalAccessTokenModel.deleteOne({
        accessToken: token,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };
}
const patServiceObj = new PersonalAccessTokenService();
module.exports = patServiceObj;
