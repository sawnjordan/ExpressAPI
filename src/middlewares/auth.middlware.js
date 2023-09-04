const jwt = require("jsonwebtoken");
const AuthService = require("../modules/auth/auth.service");
const PersonalAccessTokenModel = require("../modules/auth/access.token.model");
const patServiceObj = require("../modules/auth/personal-access-token-services");
const authService = new AuthService();
const auth = async (req, res, next) => {
  try {
    const authorizationData = req.headers["authorization"] ?? null;
    if (!authorizationData) {
      throw { status: 401, msg: "Please login first/Authorization required." };
    } else {
      const accessToken = authorizationData.split(" ").pop();
      //token validate
      //token = bearer token => ["bearer", "token"].pop()
      // let userId = await PersonalAccessTokenModel.findOne({
      //   accessToken: accessToken,
      // });

      let patData = await patServiceObj.getPATFromToken(accessToken);
      // console.log(patData, "here");

      if (!patData) {
        throw { status: 404, msg: "User is not logged in." };
      } else {
        // console.log(accessToken);
        let data = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
        //   console.log(data);
        let user = await authService.getUserById(data.id);
        if (!user) {
          next({ status: 404, msg: "User doesn't exists." });
        } else {
          req.authUser = user;
          next();
        }
      }
    }
    // console.log(accessToken);
  } catch (error) {
    // console.log(error);
    let msg = error.msg ?? "Invalid Token";
    if (error instanceof jwt.JsonWebTokenError) {
      msg = error.message;
    }

    if (error instanceof jwt.TokenExpiredError) {
      msg = error.message;
    }
    // next(error);
    next({ status: 401, msg: msg ?? "Invalid Token" });
  }
};

module.exports = auth;
