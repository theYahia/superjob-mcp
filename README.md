# @theyahia/superjob-mcp

MCP-сервер для SuperJob.ru API — поиск вакансий, информация о вакансиях. **2 инструмента.**

[![npm](https://img.shields.io/npm/v/@theyahia/superjob-mcp)](https://www.npmjs.com/package/@theyahia/superjob-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Часть серии [Russian API MCP](https://github.com/theYahia/russian-mcp) (50 серверов) by [@theYahia](https://github.com/theYahia).

## Установка

### Claude Desktop
```json
{ "mcpServers": { "superjob": { "command": "npx", "args": ["-y", "@theyahia/superjob-mcp"], "env": { "SUPERJOB_API_KEY": "ваш-ключ" } } } }
```

### Claude Code
```bash
claude mcp add superjob -e SUPERJOB_API_KEY=ваш-ключ -- npx -y @theyahia/superjob-mcp
```

| Переменная | Описание |
|------------|----------|
| `SUPERJOB_API_KEY` | API ключ (получить на api.superjob.ru) |

## Инструменты (2)

| Инструмент | Описание |
|------------|----------|
| `search_vacancies` | Поиск вакансий по словам, городу, зарплате |
| `get_vacancy` | Полная информация о вакансии |

## Примеры
```
Найди вакансии Python в Москве от 200000
```

## Лицензия
MIT
