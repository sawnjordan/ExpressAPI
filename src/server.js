require("dotenv").config();
const http = require("http");
const app = require("./config/app");
const PORT = 3005;
//loading or mounting
const server = http.createServer(app);

//extra servers can be mounted on http

server.listen(PORT, "localhost", (err) => {
  if (!err) {
    console.log(`Server is listening to port: ${PORT}`);
    console.log(`Browse: http://localhost:${PORT}`);
    console.log("Press CTRL+C to disconnect server");
  }
});
