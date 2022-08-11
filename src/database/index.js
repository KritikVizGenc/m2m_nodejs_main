const { Sequelize } = require("sequelize");


const sequelize = new Sequelize('m2mDB', 'postgres', '123456', {
    host: 'localhost',
    dialect: "postgres"
  });

sequelize.sync();

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;