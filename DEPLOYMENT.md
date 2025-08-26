# CV Agent - Deployment Guide

## 🚀 Deploying to Vercel

### Prerequisites

1. **GitHub Account**: You need a GitHub account to host your repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **OpenAI API Key**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and click "New repository"
2. Name it `cv-agent`
3. Make it public or private (your choice)
4. **Don't** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

### Step 2: Push Code to GitHub

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/cv-agent.git

# Push the code
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "New Project"
   - Select "Import Git Repository"
   - Find and select your `cv-agent` repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `.next` (should auto-detect)
   - **Install Command**: `npm install` (should auto-detect)

4. **Environment Variables**
   - Click "Environment Variables"
   - Add the following variables:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     NEXT_PUBLIC_APP_URL=https://your-project-name.vercel.app
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 2-3 minutes)

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? Select your account
# - Link to existing project? N
# - What's your project's name? cv-agent
# - In which directory is your code located? ./
# - Want to override the settings? N
# - Want to modify these settings? N
```

### Step 4: Configure Environment Variables

After deployment, go to your Vercel dashboard:

1. **Project Settings** → **Environment Variables**
2. Add the following variables:

```
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_APP_URL=https://your-project-name.vercel.app
```

3. **Redeploy** the project to apply the environment variables

### Step 5: Test Your Deployment

1. Visit your Vercel URL: `https://your-project-name.vercel.app`
2. Test the application:
   - Create a job profile
   - Upload some CV files
   - Run the analysis

## 🔧 Configuration Options

### Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. **Settings** → **Domains**
3. Add your custom domain
4. Follow the DNS configuration instructions

### Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key |
| `NEXT_PUBLIC_APP_URL` | Yes | Your Vercel deployment URL |
| `VERCEL_BLOB_READ_WRITE_TOKEN` | No | For file storage (optional) |

## 📊 Monitoring & Analytics

### Vercel Analytics

1. **Analytics** tab in your Vercel dashboard
2. Monitor:
   - Page views
   - Performance metrics
   - Error rates

### Function Logs

1. **Functions** tab in your Vercel dashboard
2. Monitor API route performance
3. Check for errors in `/api/upload` and `/api/analyze`

## 🔒 Security Considerations

### Rate Limiting

The application includes built-in rate limiting:
- Upload: 5 requests/minute
- Analysis: 3 requests/5 minutes
- General: 100 requests/minute

### API Key Security

- Never commit your API key to Git
- Use environment variables in Vercel
- Rotate your API key regularly

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check the build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript compilation

2. **API Errors**
   - Check if `OPENAI_API_KEY` is set correctly
   - Verify the API key has sufficient credits
   - Check rate limiting

3. **File Upload Issues**
   - Verify file size limits (10MB max)
   - Check supported file types (PDF, DOCX, DOC, TXT)
   - Ensure proper CORS configuration

### Getting Help

1. Check the [Vercel Documentation](https://vercel.com/docs)
2. Review the [Next.js Documentation](https://nextjs.org/docs)
3. Check the build logs in your Vercel dashboard

## 📈 Scaling Considerations

### Free Tier Limits

- **Vercel**: 100GB bandwidth/month
- **OpenAI**: Depends on your plan
- **Function Execution**: 10 seconds max

### Upgrading

- **Vercel Pro**: $20/month for more bandwidth and features
- **OpenAI**: Pay-as-you-go or monthly plans

## 🔄 Continuous Deployment

Once set up, your app will automatically deploy when you push to the `main` branch:

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push origin main

# Vercel will automatically deploy the changes
```

---

**Your CV Agent is now live! 🎉**

Visit your deployment URL and start screening CVs with AI-powered confidence scoring.
