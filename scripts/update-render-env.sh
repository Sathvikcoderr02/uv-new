#!/bin/bash

# This script will help you update your Render environment variables
# with your new cloud database connection string

echo "=== Update Render Environment Variables ==="
echo ""
echo "After you've created your Neon database and imported your data,"
echo "you need to update your Render environment variables."
echo ""
echo "1. Go to your Render dashboard: https://dashboard.render.com"
echo "2. Select your 'univendor-api' service"
echo "3. Go to Environment → Environment Variables"
echo "4. Update the DATABASE_URL variable with your Neon connection string"
echo "5. Click 'Save Changes'"
echo "6. Redeploy your service"
echo ""
echo "Your connection string should look like:"
echo "postgres://user:password@ep-something.us-east-2.aws.neon.tech/neondb"
echo ""
echo "After updating, your API will use the cloud database instead of your local one."
