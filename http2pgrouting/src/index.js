"use strict";

const Hapi = require("@hapi/hapi");
const query = require("./query");
const test = require("./test");

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "0.0.0.0",
  });

  server.route({
    method: "GET",
    path: "/test",
    handler: (request, h) => {
      return test.authentication();
    },
  });
  server.route({
    method: "POST",
    path: "/send",
    handler: (request, h) => {
      return query.send(request.payload.queryString);
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
