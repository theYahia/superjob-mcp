#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  searchVacanciesSchema,
  handleSearchVacancies,
  getVacancySchema,
  handleGetVacancy,
} from "./tools/vacancies.js";
import {
  searchEmployersSchema,
  handleSearchEmployers,
} from "./tools/employers.js";
import { getTownsSchema, handleGetTowns } from "./tools/towns.js";
import {
  getProfessionsSchema,
  handleGetProfessions,
} from "./tools/professions.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "superjob-mcp",
    version: "1.1.0",
  });

  // Tool 1: search vacancies
  server.tool(
    "search_vacancies",
    "Поиск вакансий на SuperJob по ключевым словам, городу, зарплате.",
    searchVacanciesSchema.shape,
    async (params) => ({
      content: [{ type: "text", text: await handleSearchVacancies(params) }],
    })
  );

  // Tool 2: get vacancy by id
  server.tool(
    "get_vacancy",
    "Полная информация о вакансии SuperJob по ID.",
    getVacancySchema.shape,
    async (params) => ({
      content: [{ type: "text", text: await handleGetVacancy(params) }],
    })
  );

  // Tool 3: search employers
  server.tool(
    "search_employers",
    "Поиск работодателей на SuperJob по названию и городу.",
    searchEmployersSchema.shape,
    async (params) => ({
      content: [{ type: "text", text: await handleSearchEmployers(params) }],
    })
  );

  // Tool 4: get towns/cities
  server.tool(
    "get_towns",
    "Справочник городов SuperJob. Поиск по названию, фильтр по стране.",
    getTownsSchema.shape,
    async (params) => ({
      content: [{ type: "text", text: await handleGetTowns(params) }],
    })
  );

  // Tool 5: get professions catalogue
  server.tool(
    "get_professions",
    "Справочник профессий/отраслей SuperJob (каталог).",
    getProfessionsSchema.shape,
    async (params) => ({
      content: [{ type: "text", text: await handleGetProfessions(params) }],
    })
  );

  return server;
}

async function main() {
  const args = process.argv.slice(2);
  const httpMode = args.includes("--http");
  const port = Number(args.find((a) => a.startsWith("--port="))?.split("=")[1] ?? 3000);

  const server = createServer();

  if (httpMode) {
    const { createServer: createHttpServer } = await import("node:http");

    const httpServer = createHttpServer(async (req, res) => {
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
      res.setHeader("Content-Type", "application/json");
      await server.connect(transport);
      await transport.handleRequest(req, res);
    });

    httpServer.listen(port, () => {
      console.error(`[superjob-mcp] HTTP mode on port ${port}. 5 tools.`);
    });
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("[superjob-mcp] Сервер запущен (stdio). 5 инструментов.");
  }
}

main().catch((error) => {
  console.error("[superjob-mcp] Ошибка:", error);
  process.exit(1);
});
