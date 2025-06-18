import dotenv from "dotenv";
dotenv.config();

import Fastify from "fastify";
import cors from "@fastify/cors";
import formBody from "@fastify/formbody";
import multipart from "@fastify/multipart";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";

import { appRouter } from "./trpc/router";
import { createContext } from "./trpc/context";

const port = Number(process.env.PORT) || 4000;
const apiUrl = process.env.API_URL || `http://localhost:${port}`;

const app = Fastify({
  bodyLimit: 50 * 1024 * 1024,
});

app.register(cors, { origin: true });
app.register(formBody);
app.register(multipart);

app.get("/ping", async () => ({ status: "ok" }));

app.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: { router: appRouter, createContext },
});

app.listen({ port }, () => {
  console.log(`🚀 Server ready at ${apiUrl}/trpc`);
});
