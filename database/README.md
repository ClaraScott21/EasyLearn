# Easy Learn PostgreSQL database

PostgreSQL is the shared database. Keep versioned schema changes in `migrations/` and development-only sample records in `seed-data/`.

## Naming

- Database: `easy_learn`
- Tables and columns: lowercase `snake_case`
- Primary keys: stable generated IDs
- Store passwords only as secure hashes through the authentication layer; never seed real credentials.

Coordinate migration names and API entity changes with the backend teammate before merging them.
