---
name: job-search
description: Поиск вакансий на SuperJob по специальности, городу и зарплате
argument-hint: <специальность> [город] [зарплата от]
allowed-tools:
  - Bash
  - Read
---

# /job-search — Поиск вакансий на SuperJob

## Алгоритм

1. Вызови `search_vacancies` с keyword, town, payment_from
2. Покажи список с зарплатами и ссылками

## Примеры

```
/job-search Python Москва 200000
/job-search менеджер
```
