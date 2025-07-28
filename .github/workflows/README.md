# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the ContentSync project.

## Workflows

### 1. CodeQL (`codeql.yml`)
- **Purpose**: Static application security testing (SAST) using GitHub's CodeQL
- **Triggers**: Push to main, pull requests, weekly schedule
- **What it does**: 
  - Scans JavaScript/TypeScript code for security vulnerabilities
  - Identifies common security issues like SQL injection, XSS, etc.
  - Uploads results to GitHub Security tab

### 2. Security (`security.yml`)
- **Purpose**: Comprehensive security scanning
- **Triggers**: Push to main, pull requests, daily schedule
- **What it does**:
  - Dependency vulnerability scanning (npm audit)
  - Secret scanning (TruffleHog)
  - Container scanning (Trivy) - if Dockerfile exists
  - SAST with Semgrep

### 3. CI/CD (`ci.yml`)
- **Purpose**: Continuous integration and deployment
- **Triggers**: Push to main/develop, pull requests
- **What it does**:
  - Runs tests and linting
  - Builds the application
  - Deploys to Vercel (preview for PRs, production for main)

## Setup Instructions

### 1. Enable GitHub Actions
1. Go to your repository on GitHub
2. Navigate to Settings > Actions > General
3. Enable "Allow all actions and reusable workflows"

### 2. Set up Vercel Integration (for CI/CD)
1. Get your Vercel tokens:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and get tokens
   vercel login
   vercel link
   ```

2. Add GitHub Secrets:
   - Go to Settings > Secrets and variables > Actions
   - Add the following secrets:
     - `VERCEL_TOKEN`: Your Vercel token
     - `VERCEL_ORG_ID`: Your Vercel organization ID
     - `VERCEL_PROJECT_ID`: Your Vercel project ID

### 3. Enable Security Features
1. **CodeQL**: Automatically enabled when workflow is pushed
2. **Dependabot**: Enable in Settings > Security > Dependabot
3. **Secret scanning**: Enable in Settings > Security > Secret scanning

## Security Best Practices

### Environment Variables
- Never commit sensitive data to the repository
- Use GitHub Secrets for all sensitive values
- Use `NEXT_PUBLIC_` prefix only for client-side variables

### Dependencies
- Regularly update dependencies
- Use `npm audit` to check for vulnerabilities
- Consider using `npm audit fix` for automatic fixes

### Code Quality
- Run linting before committing
- Use TypeScript for type safety
- Follow security best practices in code

## Troubleshooting

### Common Issues

1. **Workflow fails on dependency installation**
   - Check if `package-lock.json` is committed
   - Verify Node.js version compatibility

2. **Vercel deployment fails**
   - Verify Vercel tokens are correct
   - Check if environment variables are set in Vercel

3. **Security scans show false positives**
   - Review the findings in GitHub Security tab
   - Add suppressions for known false positives

### Getting Help
- Check GitHub Actions logs for detailed error messages
- Review GitHub Security tab for security findings
- Consult Vercel documentation for deployment issues 