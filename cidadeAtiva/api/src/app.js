import express from "express";
import cors from "cors";
import perfilRoutes from "./routes/perfilRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/perfil", perfilRoutes);

export default app;
