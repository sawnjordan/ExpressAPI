const generateRandomStrings = (len = 100) => {
  let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let strlen = chars.length;
  let randomString = "";
  for (let i = 0; i < len; i++) {
    let charPosition = Math.ceil(Math.random() * (strlen - 1));
    // console.log(charPosition);
    randomString = randomString + chars[charPosition];
  }
  return randomString;
  // console.log(ran);
};

module.exports = { generateRandomStrings };
