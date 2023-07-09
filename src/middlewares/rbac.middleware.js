const checkPermission = (role) => {
  return (req, res, next) => {
    let user = req.authUser;
    if (!user) {
      throw { status: 401, msg: "Please Login." };
    } else {
      if (Array.isArray(role)) {
        if (role.includes(user.role)) {
          next();
        } else {
          next({ status: 401, msg: "Access Denied." });
        }
      } else {
        if (user.role === role) {
          next();
        } else {
          next({ status: 401, msg: "Access Denied." });
        }
      }
    }
  };
};
module.exports = checkPermission;
