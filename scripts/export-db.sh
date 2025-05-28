#!/bin/bash

# Database connection details
DB_NAME="univendor"
DB_USER="postgres"
DB_PASSWORD="divyesh"
DB_HOST="127.0.0.1"
DB_PORT="5432"

# Output file
DUMP_FILE="univendor_dump.sql"

echo "Exporting complete database (schema and data)..."
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME --clean --if-exists > $DUMP_FILE

echo "Export complete!"
echo "Database dump saved to: $DUMP_FILE"
