# Quiz 📓📝

It's like quizlet for math flashcards setup by teachers for their students.
Scores are recorded for teachers to view to save time grading weekly quizzes.

![](/docs/screenshot1.jpg)

[![Postgres Backup and Upload](https://github.com/bmitchinson/quiz/actions/workflows/pg_backup.yaml/badge.svg)](https://github.com/bmitchinson/quiz/actions/workflows/pg_backup.yaml)

note: the code quality here is all over the place! This is a deliberate exercise
in trying to use AI CodeGen as much as possible, to learn about when the downsides
kick in.

### Commands

Reminders for myself:

- `./utils/pull_prod_to_local_db.sh` [`import_only` or `download_only`] (download prod data from azure backups to import into local db)
- `docker compose up -d` + `docker compose down` (orbstack)
- `npm run test` or `npm run test:gui` (playwright tests only)
- `npm run dev`
- `npm run db:seed` seed local database with seedData.ts
  - `npm run db:seed:dev` seed staging site / remote dev db

quiz.mitchinson.dev - `main`

quiz-staging.mitchinson.dev - `dev`

### Tools

- vercel hosting w sveltekit instead of react
- vercel postgres (neon) + supabase
- prismadb
- cloudflare
- tailwind
- lots and lots of chatgpt o1 as an exercise in AI codegen for rapid
  development
