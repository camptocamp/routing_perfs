const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "postgres://routing_user:routing@pgrouting:5432/routing_db"
);

async function authentication() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    return "OK";
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return "KO";
  }
}

exports.authentication = authentication;
