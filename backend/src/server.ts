import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { AppDataSource } from "./db/datasource";
import { schema as typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";
import healthRouter from "./healthChecks/healthRouter";

const PORT = Number(process.env.PORT) || 4000;

async function main() {
  console.log("Starting server...");

  await AppDataSource.initialize();
  console.log("Database connected");

  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  app.use(healthRouter);
  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server) as unknown as express.RequestHandler,
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve),
  );
  console.log(`Server running at http://localhost:${PORT}/graphql`);
  console.log(
    `Health checks available at: http://localhost:${PORT}/health/live,  http://localhost:${PORT}/health/ready`,
  );
}

main().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});
