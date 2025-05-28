# Updating Render Environment Variables

Follow these steps to update your Render deployment with the new cloud database connection:

1. **Go to your Render dashboard**
   - Visit [https://dashboard.render.com](https://dashboard.render.com) and log in

2. **Select your API service**
   - Find and click on your "univendor-api" service

3. **Update Environment Variables**
   - Navigate to "Environment" tab
   - Find the `DATABASE_URL` variable
   - Update its value to:
     ```
     postgresql://neondb_owner:npg_MgD6I0eNokLv@ep-lucky-rice-a57yzbrw-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
     ```
   - Click "Save Changes"

4. **Redeploy your service**
   - Click "Manual Deploy" → "Deploy latest commit"

5. **Verify the deployment**
   - Once deployed, test your API by visiting:
     - `https://univendor-api.onrender.com/health`
     - `https://univendor-api.onrender.com/api/products/14`

Your API should now be connected to your cloud database, and your Vercel frontend should be able to fetch data from it.
