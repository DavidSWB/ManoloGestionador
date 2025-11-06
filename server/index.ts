import express from "express";
import cors from "cors";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
//  .js añadido aquí
import { connectDB } from "./db.js"; 
//  .js añadido en todas estas rutas
import authRouter from "./routes/auth.js";
import clientesRouter from "./routes/clientes.js";
import mascotasRouter from "./routes/mascotas.js";
import serviciosRouter from "./routes/servicios.js";
import cobrosRouter from "./routes/cobros.js";
import recordatoriosRouter from "./routes/recordatorios.js";
import reportsRouter from "./routes/reports.js";
import testMailRouter from "./routes/test-mail.js";

dotenv.config();

function setupApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/auth", authRouter);
  app.use("/clientes", clientesRouter);
  app.use("/mascotas", mascotasRouter);
  app.use("/servicios", serviciosRouter);
  app.use("/cobros", cobrosRouter);
  app.use("/recordatorios", recordatoriosRouter);
  app.use("/reports", reportsRouter);
  app.use("/", testMailRouter);

  app.get("/api/ping", (req, res) => res.json({ message: "pong" }));

  app.get("/seed", async (req, res) => {
    try {
      const db = await connectDB();
      // seed sample data
      const clientes = [
        { nombre: "Laura Rojas", correo: "laura@correo.com", telefono: "3115551234", creadoEn: new Date() },
        { nombre: "Carlos Pérez", correo: "carlos@correo.com", telefono: "3102229876", creadoEn: new Date() },
      ];
      const res1 = await db.collection("clientes").insertMany(clientes as any);

      const mascotas = [
        { clienteId: res1.insertedIds["0"], nombre: "Luna", especie: "Perro", raza: "Labrador", creadoEn: new Date() },
        { clienteId: res1.insertedIds["1"], nombre: "Michi", especie: "Gato", raza: "Siames", creadoEn: new Date() },
      ];
      await db.collection("mascotas").insertMany(mascotas as any);

      const servicios = [
        { nombre: "Paseo diario", tarifa: 15000, duracion: "1 hora", activo: true, creadoEn: new Date() },
        { nombre: "Baño y corte", tarifa: 25000, duracion: "45 min", activo: true, creadoEn: new Date() },
      ];
      const res3 = await db.collection("servicios").insertMany(servicios as any);

      const cobros = [
        { clienteId: res1.insertedIds["0"], servicioId: res3.insertedIds["0"], fecha: new Date().toISOString(), cantidad: 1, montoUnitario: 15000, estado: "pendiente", creadoEn: new Date() },
        { clienteId: res1.insertedIds["1"], servicioId: res3.insertedIds["1"], fecha: new Date().toISOString(), cantidad: 1, montoUnitario: 25000, estado: "pagado", creadoEn: new Date() },
      ];
      await db.collection("cobros").insertMany(cobros as any);

      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  return app;
}

export function createServer() {
  // create server without starting listener — used by Vite dev server
  return setupApp();
}

// async function start() {
//   await connectDB();
//   const port = Number(process.env.PORT || 4000);
//   const app = setupApp();
//   app.listen(port, () => console.log("Server listening on port", port));
// }

// if (process.env.NODE_ENV !== "test" && process.env.RUN_SERVER !== "false") {
//   start();
// }

export default setupApp();
