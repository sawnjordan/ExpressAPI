require("dotenv").config();
const server = require("./config/socker.server");

const PORT = 3005;

//loading or mounting

//extra servers can be mounted on http

server.listen(PORT, "localhost", (err) => {
  if (!err) {
    console.log(`Server is listening to port: ${PORT}`);
    console.log(`Browse: http://localhost:${PORT}`);
    console.log("Press CTRL+C to disconnect server");
  }
});
