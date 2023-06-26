const AuthController = require("./auth.controller");
const AuthService = require("./auth.service");
const authService = new AuthService();
const authCtrl = new AuthController(authService);

module.exports = { authCtrl, authService };
