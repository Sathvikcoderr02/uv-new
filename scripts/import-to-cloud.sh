#!/bin/bash

# Neon database connection string
CLOUD_DB_URL="postgresql://neondb_owner:npg_MgD6I0eNokLv@ep-lucky-rice-a57yzbrw-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Input file
DUMP_FILE="univendor_dump.sql"

echo "Importing database to cloud..."
psql "$CLOUD_DB_URL" < $DUMP_FILE

echo "Import complete!"
echo "Your database has been migrated to the cloud."
echo "Don't forget to update your Render environment variables with this connection string!"
