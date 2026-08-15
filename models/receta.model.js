import { Sequelize } from "sequelize";
import db from "../config/db.js";

const Receta = db.define(
  "Receta",
  {
    id_receta: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    nombre: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    descripcion: {
      type: Sequelize.TEXT,
      allowNull: false,
    },

    ingredientes: {
      type: Sequelize.TEXT,
      allowNull: false,
    },

    preparacion: {
      type: Sequelize.TEXT,
      allowNull: false,
    },

    categoria: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    tiempo_preparacion: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },

    dificultad: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "Fácil",
    },

    imagen_url: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "Recetas",
  },
);

export default Receta;
