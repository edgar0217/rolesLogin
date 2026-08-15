import { Sequelize } from "sequelize";
import db from "../config/db.js";

const User = db.define(
  "User",
  {
    id_usuario: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    rol: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "usuario",
      validate: {
        isIn: [["usuario", "cliente", "administrador", "superadministrador"]],
      },
    },

    estado: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isIn: [[0, 1]],
      },
    },
  },
  {
    tableName: "Usuarios",
  },
);

export default User;
