# Vercel Deployment Guide

## Authentication Fix Applied ✅

The authentication issue has been resolved by switching from cookie-based to Bearer token authentication for better Vercel/serverless compatibility.

### Changes Made:

1. **Frontend (Client)**:
   - ✅ Updated `apiClient.js` to use `withCredentials: false` and Authorization headers
   - ✅ Modified `AuthContext.jsx` to store JWT tokens in localStorage
   - ✅ Added automatic token setting in API requests
   - ✅ Updated login/signup to extract and store tokens

2. **Backend (Server)**:
   - ✅ Updated CORS configuration for better production support
   - ✅ Backend already supports both cookie and Bearer token authentication

## Deployment Steps

### Step 1: Deploy Backend to Vercel

1. Go to [vercel.com](https://vercel.com) and import your repository
2. Set the root directory to `server`
3. Add these environment variables in Vercel dashboard:
   ```
   NODE_ENV=production
   DATABASE_URI=your-mongodb-connection-string
   JWT_SECRET=your-super-secure-secret-key
   JWT_EXPIRES_IN=90d
   JWT_COOKIE_EXPIRES_IN=90
   FRONTEND_ORIGIN=https://your-frontend-app.vercel.app
   ```
4. Deploy and note your backend URL (e.g., `https://your-backend.vercel.app`)

### Step 2: Deploy Frontend to Vercel

1. Import your repository again or create a new project
2. Set the root directory to `client`
3. Add this environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend.vercel.app/api/v1
   ```
4. Deploy and note your frontend URL

### Step 3: Update CORS Configuration

1. Go back to your backend Vercel project
2. Update the `FRONTEND_ORIGIN` environment variable with your actual frontend URL
3. Redeploy the backend

### Step 4: Test Authentication

1. Visit your frontend URL
2. Try signing up for a new account
3. Try logging in with existing credentials
4. Check that protected routes work (creating blogs, bookmarks, etc.)

## How the Fix Works

- **Development**: Still uses cookies for convenience
- **Production**: Uses localStorage + Authorization headers for reliability
- **Automatic token management**: Tokens are automatically added to all API requests
- **Fallback support**: Backend still accepts both authentication methods

## Troubleshooting

If you still have issues:

1. **Check browser network tab** - verify Authorization headers are being sent
2. **Check Vercel function logs** - look for authentication errors
3. **Verify environment variables** - ensure all required vars are set in Vercel
4. **CORS errors** - update FRONTEND_ORIGIN to match your exact frontend URL

The authentication should now work properly in your Vercel deployment! 🚀