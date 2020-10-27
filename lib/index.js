const monitoring = require("./src/monitoring");
const { server } = require("./src/monitoring");

server(4000).then((monitoring) => {
  setTimeout(() => monitoring.setUp(), 2000);
});
