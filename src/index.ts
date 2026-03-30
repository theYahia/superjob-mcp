#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { searchVacanciesSchema, handleSearchVacancies, getVacancySchema, handleGetVacancy } from "./tools/vacancies.js";

const server = new McpServer({ name: "superjob-mcp", version: "1.0.0" });

server.tool("search_vacancies", "Поиск вакансий на SuperJob по ключевым словам, городу, зарплате.", searchVacanciesSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleSearchVacancies(params) }] }));

server.tool("get_vacancy", "Полная информация о вакансии SuperJob.", getVacancySchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetVacancy(params) }] }));

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[superjob-mcp] Сервер запущен. 2 инструмента.");
}

main().catch((error) => { console.error("[superjob-mcp] Ошибка:", error); process.exit(1); });
