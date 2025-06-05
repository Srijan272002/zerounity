# Supabase Configuration

This directory contains the configuration for the Supabase database and authentication system used in the project.

## Migrations

The migrations directory contains SQL files that are executed in order to set up the database schema:

- `20240305_001_init_auth.sql`: Sets up the authentication system and user tables
- `20240305_002_profiles.sql`: Creates the user profiles table and related triggers
- `20240305_003_storage.sql`: Configures storage buckets and policies for file storage

## Type Generation

The project uses automatic type generation from the Supabase schema. Types are generated and stored in `shared/types/supabase.ts`.

### Generating Types

To regenerate the TypeScript types from the Supabase schema, run:

```bash
npm run supabase:types
```

This will update the types based on the current database schema.

## Development Workflow

1. Start the local Supabase instance:

```bash
npm run supabase:start
```

2. Run migrations (if needed):

```bash
npm run db:reset
```

3. Generate types:

```bash
npm run supabase:types
```

4. Stop the Supabase instance when done:

```bash
npm run supabase:stop
```

## Authentication

The project uses Supabase Auth for authentication and user management. The migrations set up the following:

- User authentication table with email/password and OAuth providers
- Row-level security policies for data protection
- User profiles for additional user information

## Storage

File storage is handled through Supabase Storage with the following buckets:

- `avatars`: For user profile images with appropriate access policies

## Adding New Migrations

To create a new migration:

1. Create a new SQL file in the `migrations` directory with a timestamp prefix
2. Add your SQL statements to create/alter tables, functions, triggers, etc.
3. Apply the migration using the Supabase CLI
4. Regenerate types if your changes affect the schema

## Common Issues

- **Type errors**: Make sure to run `npm run supabase:types` after schema changes
- **Permission issues**: Check the RLS policies in the migrations
- **Migration failures**: Ensure your SQL follows PostgreSQL best practices and is idempotent 