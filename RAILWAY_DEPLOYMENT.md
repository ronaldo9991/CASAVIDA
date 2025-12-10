# Railway Deployment Guide

## Prerequisites
- Railway account (sign up at https://railway.app)
- GitHub repository with your code
- API keys for:
  - Gemini API (for text generation)
  - Murf AI API (for voice generation - free tier: 10 minutes/month)

## Step 1: Create a New Project on Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository: `ronaldo9991/CASAVIDA`

## Step 2: Add PostgreSQL Database

1. In your Railway project dashboard, click "+ New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically provision a PostgreSQL database
4. **Important**: Note the database service name (e.g., "Postgres")

## Step 3: Link Database to Web Service

1. Click on your web service (the one deploying your app)
2. Go to the "Variables" tab
3. Railway should automatically add `DATABASE_URL` when you link the database
4. If not, click "+ New Variable" and add:
   - Key: `DATABASE_URL`
   - Value: (Railway will provide this from the PostgreSQL service)

**Alternative method to link database:**
1. Click on the PostgreSQL service
2. Go to the "Connect" tab
3. Copy the connection string
4. In your web service, add it as `DATABASE_URL` environment variable

## Step 4: Add Required Environment Variables

In your web service's "Variables" tab, add the following:

### Required API Keys:
```
GEMINI_API_KEY=your-gemini-api-key-here
MURF_API_KEY=your-murf-ai-api-key-here
```

**How to get Murf AI API Key:**
1. Sign up at https://murf.ai (free account includes 10 minutes/month)
2. Go to your dashboard → API section
3. Generate an API key
4. Copy the key and add it to Railway as `MURF_API_KEY`

### Optional (Railway sets these automatically):
```
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://... (set automatically when database is linked)
```

## Step 5: Run Database Migrations

After the database is provisioned and linked:

1. In Railway, go to your web service
2. Open the "Settings" tab
3. Under "Deploy", you can add a one-time command to run migrations:
   - Command: `npm run db:push`
   - Or use Railway's CLI: `railway run npm run db:push`

Alternatively, you can run migrations manually:
1. Install Railway CLI: `npm i -g @railway/cli`
2. Run: `railway link` (select your project)
3. Run: `railway run npm run db:push`

## Step 6: Deploy

Railway will automatically deploy when you push to your GitHub repository's main branch.

To trigger a manual deployment:
1. Go to your service in Railway
2. Click "Deploy" → "Redeploy"

## Troubleshooting

### Error: "DATABASE_URL must be set"

**Solution**: Make sure you've:
1. Added a PostgreSQL service to your Railway project
2. Linked the database to your web service
3. The `DATABASE_URL` variable should appear automatically in your web service's variables

**To verify:**
1. Go to your web service → Variables tab
2. Check if `DATABASE_URL` exists
3. If not, manually link the database:
   - Go to PostgreSQL service → Connect tab
   - Copy the connection string
   - Add it as `DATABASE_URL` in your web service

### Database Connection Issues

If you see connection errors:
1. Verify the database is running (check PostgreSQL service status)
2. Check that `DATABASE_URL` is correctly formatted
3. Ensure the database service and web service are in the same Railway project

### Build Failures

If the build fails:
1. Check the build logs in Railway
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version (should be 18+ as specified in `package.json`)

## Environment Variables Reference

| Variable | Required | Description | Where to Get |
|----------|----------|-------------|--------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | Auto-set by Railway when database is linked |
| `GEMINI_API_KEY` | Yes | Google Gemini API key | https://ai.google.dev/ |
| `MURF_API_KEY` | Yes | Murf AI API key (free tier: 10 min/month) | https://murf.ai/api - Sign up and get API key from dashboard |
| `PORT` | No | Server port (default: 5000) | Auto-set by Railway |
| `NODE_ENV` | No | Environment (default: production) | Auto-set by Railway |

## Next Steps

After successful deployment:
1. Your app will be available at: `https://your-app-name.up.railway.app`
2. You can set up a custom domain in Railway settings
3. Monitor logs in the Railway dashboard
4. Set up alerts for errors in Railway settings

