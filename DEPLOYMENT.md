# CreatorAI Manager - Deployment Guide

## 🚀 Deployment Checklist

### ✅ Pre-Deployment Updates (Already Done)
- [x] Updated database from SQLite to PostgreSQL
- [x] Added proper Next.js configuration for production
- [x] Created deployment setup script
- [x] Added Prisma generate to build process

## 📋 Required Environment Variables

Copy these environment variables to your Vercel dashboard:

### 🔑 **Required for Basic Functionality**
```env
DATABASE_URL="postgresql://username:password@host:5432/database_name"
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-secret-key-here"
```

### 🔑 **Required for Google OAuth**
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 🔑 **Required for AI Features**
```env
OPENAI_API_KEY="your-openai-api-key"
```

### 🔑 **Optional (for background jobs)**
```env
REDIS_URL="redis://username:password@host:6379"
```

## 🛠️ Step-by-Step Deployment Process

### 1. **Set up PostgreSQL Database**
Choose one of these options:

#### Option A: Vercel Postgres (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Create" → "Storage" → "Postgres"
3. Name your database: `creatorai-db`
4. Select region closest to your users
5. Copy the `DATABASE_URL` connection string

#### Option B: Supabase (Free tier available)
1. Go to [Supabase](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your actual password

#### Option C: Railway
1. Go to [Railway](https://railway.app)
2. Create new project
3. Add PostgreSQL service
4. Copy connection string from Variables tab

### 2. **Set up Google OAuth**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen:
   - Application name: "CreatorAI Manager"
   - Authorized domains: Add your Vercel domain
6. Create OAuth 2.0 Client ID:
   - Application type: "Web application"
   - Authorized redirect URIs: `https://your-app.vercel.app/api/auth/callback/google`
7. Copy `Client ID` and `Client Secret`

### 3. **Set up OpenAI API**
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create account or log in
3. Go to "API Keys" → "Create new secret key"
4. Name it: "CreatorAI Manager"
5. Copy the API key (starts with `sk-`)

### 4. **Generate NextAuth Secret**
Run this command in your terminal:
```bash
openssl rand -base64 32
```
Or use online generator: [generate-secret.now.sh](https://generate-secret.now.sh/32)

### 5. **Deploy to Vercel**
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Import Project"
4. Import your GitHub repository
5. Configure project:
   - Framework: Next.js
   - Root directory: `./`
   - Build command: `npm run build`
   - Output directory: `.next`

### 6. **Add Environment Variables**
In your Vercel project settings:
1. Go to "Settings" → "Environment Variables"
2. Add all the required environment variables:

```env
DATABASE_URL=postgresql://username:password@host:5432/database_name
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-generated-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENAI_API_KEY=your-openai-api-key
```

### 7. **Set up Database Schema**
After deployment, run this command locally:
```bash
# Replace with your production DATABASE_URL
DATABASE_URL="your-production-db-url" npx prisma db push
```

### 8. **Create Admin User**
Run the deployment setup script:
```bash
DATABASE_URL="your-production-db-url" npm run deploy:setup
```

This will create an admin user:
- Email: `admin@creatorai.com`
- Password: `admin123!`

## 🔍 Verification Steps

After deployment, verify:
1. ✅ App loads at your Vercel URL
2. ✅ Google OAuth works
3. ✅ Database connection works
4. ✅ Admin login works
5. ✅ AI features work (email generation)

## 🐛 Common Issues & Solutions

### Issue: "Prisma Client not found"
**Solution**: Ensure `postinstall` script runs `prisma generate`

### Issue: "Database connection failed"
**Solution**: Check DATABASE_URL format and credentials

### Issue: "Google OAuth not working"
**Solution**: Verify redirect URI in Google Console matches your domain

### Issue: "AI features not working"
**Solution**: Check OpenAI API key and billing setup

## 📊 Post-Deployment

### Update Google OAuth Settings
1. Go to Google Cloud Console
2. Update authorized domains to include your Vercel domain
3. Update redirect URI to: `https://your-app.vercel.app/api/auth/callback/google`

### Test All Features
1. Sign up/Sign in with Google
2. Create test agency
3. Add test creators
4. Test AI email generation
5. Test deal tracking

## 🔒 Security Recommendations

1. **Change default admin password immediately**
2. **Use strong NEXTAUTH_SECRET**
3. **Enable 2FA on all service accounts**
4. **Set up monitoring and alerts**
5. **Regular security updates**

## 🎯 Optional Enhancements

### Add Custom Domain
1. Go to Vercel project settings
2. Add your custom domain
3. Update NEXTAUTH_URL to your custom domain
4. Update Google OAuth settings

### Set up Redis (for background jobs)
1. Use Upstash Redis (free tier)
2. Add REDIS_URL to environment variables
3. Deploy background job features

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check database connection
3. Verify all environment variables
4. Test locally first

---

🚀 **Ready to deploy!** Your CreatorAI Manager platform is now production-ready! 