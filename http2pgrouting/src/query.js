const { QueryTypes, Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "postgres://routing_user:routing@pgrouting:5432/routing_db"
);

async function send(queryString) {
  const queryResponse = await sequelize.query(queryString, {
    type: QueryTypes.SELECT,
  });
  return queryResponse;
}

exports.send = send;
