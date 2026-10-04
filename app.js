import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import db from "./config/db.js";
import noCache from "./middlewares/noCache.js";
import recetaRoutes from "./routes/recetas.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import clienteRoutes from "./routes/cliente.routes.js";
import superadminRoutes from "./routes/superadmin.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(noCache);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "clave-secreta-desarrollo",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.use(authRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use(clienteRoutes);
app.use(superadminRoutes);
app.use(recetaRoutes);

app.get("/", (req, res) => {
  return res.render("index", {
    user: req.session.user || null,
  });
});

app.use((req, res) => {
  res.status(404).render("404");
});

try {
  await db.authenticate();
  await db.sync();

  console.log("Conectado a la base de datos");
} catch (error) {
  console.error("Error al conectar con la base de datos:", error);
}

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
