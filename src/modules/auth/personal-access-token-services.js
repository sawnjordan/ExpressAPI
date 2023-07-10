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

  getPATFromToken = async (token) => {
    try {
      let data = await PersonalAccessTokenModel.findOne({
        $or: [{ accessToken: token }, { refreshToken: token }],
      });
      if (data) {
        return data;
      } else {
        throw { status: 400, msg: "Token Query Error / No PAT found." };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}
const patServiceObj = new PersonalAccessTokenService();
module.exports = patServiceObj;
