# Deployment Guide

This guide explains how to deploy the Habit Tracker application to Netlify.

## Prerequisites

1. A GitHub account
2. A Netlify account
3. The code should be pushed to a GitHub repository

## Deploying to Netlify

### Step 1: Connect Netlify to Your GitHub Repository

1. Go to [netlify.com](https://netlify.com) and sign in or create an account
2. Click "New site from Git"
3. Choose "GitHub" as your Git provider
4. Select your repository (todos) from the list
5. Netlify should automatically detect the build settings from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Step 2: Configure Site Settings

1. In the "Site settings" section, you can customize:
   - Site name (optional)
   - Custom domain (optional)
2. Click "Deploy site"

### Step 3: Environment Variables (If Needed)

If your application requires environment variables:
1. Go to your site settings in Netlify
2. Navigate to "Build & deploy" > "Environment"
3. Add any required environment variables

For this Habit Tracker app, you may need to add Firebase configuration variables if you're not including them directly in the code:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- etc.

### Step 4: Continuous Deployment

Netlify will automatically rebuild and deploy your site whenever you push changes to the main branch of your GitHub repository.

## Manual Deployment

If you prefer to deploy manually:

1. Build your project:
   ```bash
   npm run build
   ```

2. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

3. Deploy using Netlify CLI:
   ```bash
   netlify deploy --prod
   ```

## Custom Domain (Optional)

To use a custom domain:

1. Go to your site settings in Netlify
2. Navigate to "Domain management"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Troubleshooting

### Build Issues

If you encounter build issues:
1. Check the build logs in Netlify for error messages
2. Ensure all dependencies are in `package.json`
3. Verify the build command in `netlify.toml` is correct

### Routing Issues

If routing doesn't work properly:
1. Ensure `public/_redirects` file exists with the correct redirect rule
2. For React Router, the rule should be: `/* /index.html 200`

## Netlify Functions

This project includes a sample Netlify function in `netlify/functions/hello.js`. You can access it at:
`/.netlify/functions/hello`

To add more functions:
1. Create new files in the `netlify/functions` directory
2. Each file should export a `handler` function
3. Functions are automatically deployed and accessible at `/.netlify/functions/function-name`