# Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the WebCraft application to various hosting platforms. The application is designed to be deployment-ready with minimal configuration required.

## Table of Contents

1. [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
2. [Netlify Deployment](#netlify-deployment)
3. [Heroku Deployment](#heroku-deployment)
4. [Digital Ocean Deployment](#digital-ocean-deployment)
5. [AWS Deployment](#aws-deployment)
6. [Docker Deployment](#docker-deployment)
7. [Environment Variables](#environment-variables)
8. [Domain Configuration](#domain-configuration)
9. [SSL/HTTPS Setup](#sslhttps-setup)
10. [Monitoring and Analytics](#monitoring-and-analytics)
11. [Troubleshooting](#troubleshooting)

---

## Vercel Deployment (Recommended)

Vercel is the recommended deployment platform due to its excellent support for React applications and serverless functions.

### Prerequisites
- GitHub, GitLab, or Bitbucket account
- Vercel account (free)
- Project pushed to Git repository

### Automated Deployment (Recommended)

1. **Connect Repository to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy from project root
   vercel
   ```

2. **Follow the Interactive Setup**
   ```
   ? Set up and deploy "~/trae_projects"? [Y/n] y
   ? Which scope do you want to deploy to? Your Account
   ? Link to existing project? [y/N] n
   ? What's your project's name? webcraft
   ? In which directory is your code located? ./
   ? Override settings? [y/N] n
   ```

3. **Automatic Configuration**
   Vercel will automatically detect:
   - React frontend (Vite)
   - Express.js API routes
   - Build configuration
   - Environment variables

4. **Deployment Complete**
   - Frontend: `https://webcraft.vercel.app`
   - API: `https://webcraft.vercel.app/api/*`

### Manual Configuration

If automatic detection fails, create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Environment Variables in Vercel

1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add the following variables:
   ```
   NODE_ENV=production
   JWT_SECRET=your_jwt_secret_key
   DATABASE_URL=your_database_connection_string
   ```

---

## Netlify Deployment

Netlify is an excellent alternative with great features for static sites and serverless functions.

### Prerequisites
- GitHub account
- Netlify account (free)

### Deployment Steps

1. **Build the Project Locally**
   ```bash
   npm run build
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your Git provider
   - Select your repository

3. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add production environment variables

5. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy automatically

### Netlify Configuration File

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_ENV = "production"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Heroku Deployment

Heroku provides a traditional server-based deployment option.

### Prerequisites
- Heroku account
- Heroku CLI installed
- Git repository

### Deployment Steps

1. **Create Heroku App**
   ```bash
   # Login to Heroku
   heroku login

   # Create new app
   heroku create webcraft-app
   ```

2. **Configure Buildpacks**
   ```bash
   # Add Node.js buildpack
   heroku buildpacks:add heroku/nodejs

   # Add React buildpack (if needed)
   heroku buildpacks:add mars/create-react-app
   ```

3. **Create Heroku Configuration**
   Create `Procfile` in project root:
   ```
   web: npm run start:prod
   ```

4. **Add Scripts to package.json**
   ```json
   {
     "scripts": {
       "start:prod": "npm run build && npm run server:prod",
       "server:prod": "node api/index.js"
     }
   }
   ```

5. **Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_secret_key
   heroku config:set DATABASE_URL=your_database_url
   ```

6. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

---

## Digital Ocean Deployment

Digital Ocean provides more control and is cost-effective for larger applications.

### Prerequisites
- Digital Ocean account
- Basic Linux server management knowledge

### Deployment Steps

1. **Create Droplet**
   - Choose Ubuntu 20.04 LTS
   - Select appropriate size ($5/month minimum)
   - Add SSH keys for secure access

2. **Connect to Server**
   ```bash
   ssh root@your_droplet_ip
   ```

3. **Install Dependencies**
   ```bash
   # Update system
   apt update && apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   apt-get install -y nodejs

   # Install PM2 process manager
   npm install -g pm2

   # Install Nginx
   apt install nginx -y
   ```

4. **Setup Application**
   ```bash
   # Clone your repository
   git clone https://github.com/yourusername/trae_projects.git
   cd trae_projects

   # Install dependencies
   npm install

   # Build the project
   npm run build
   ```

5. **Configure Environment**
   ```bash
   # Create environment file
   cp .env.example .env.production
   nano .env.production
   ```

6. **Setup PM2**
   ```bash
   # Start application with PM2
   pm2 start api/index.js --name webcraft-api

   # Save PM2 configuration
   pm2 save
   pm2 startup
   ```

7. **Configure Nginx**
   Create `/etc/nginx/sites-available/webcraft`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       # Frontend
       location / {
           root /var/www/webcraft/dist;
           try_files $uri $uri/ /index.html;
       }

       # API
       location /api {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

8. **Enable Site**
   ```bash
   ln -s /etc/nginx/sites-available/webcraft /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

---

## AWS Deployment

AWS provides enterprise-grade deployment options with high scalability.

### Option 1: AWS Elastic Beanstalk (Recommended)

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize Elastic Beanstalk**
   ```bash
   eb init
   ```

3. **Create Environment**
   ```bash
   eb create production-env
   ```

4. **Configure Environment Variables**
   ```bash
   eb setenv NODE_ENV=production
   eb setenv JWT_SECRET=your_secret
   ```

5. **Deploy**
   ```bash
   eb deploy
   ```

### Option 2: AWS EC2 with Load Balancer

1. **Create EC2 Instance**
   - Use Amazon Linux 2 AMI
   - Configure security groups (ports 80, 443, 22)
   - Generate key pair

2. **Setup Instance**
   ```bash
   # Connect to instance
   ssh -i your-key.pem ec2-user@your-instance-ip

   # Install Node.js
   curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install -y nodejs

   # Install PM2
   npm install -g pm2
   ```

3. **Deploy Application**
   Similar to Digital Ocean deployment steps

4. **Setup Load Balancer**
   - Create Application Load Balancer
   - Configure target groups
   - Setup health checks

5. **Setup Auto Scaling**
   - Create launch configuration
   - Configure auto scaling group
   - Set scaling policies

---

## Docker Deployment

Docker provides consistent deployment across all environments.

### Dockerfile

Create `Dockerfile` in project root:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/api ./api
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3001

# Start application
CMD ["node", "api/index.js"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  webcraft:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=your_secret_key
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./dist:/usr/share/nginx/html
    depends_on:
      - webcraft
    restart: unless-stopped
```

### Deployment Steps

1. **Build Docker Image**
   ```bash
   docker build -t webcraft:latest .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Push to Registry (Optional)**
   ```bash
   # Tag image
   docker tag webcraft:latest yourusername/webcraft:latest

   # Push to Docker Hub
   docker push yourusername/webcraft:latest
   ```

---

## Environment Variables

### Required Variables

```bash
# Application
NODE_ENV=production
PORT=3001

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Database
DATABASE_URL=your_database_connection_string

# Email (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# External APIs
STRIPE_SECRET_KEY=sk_test_your_stripe_key
SENDGRID_API_KEY=your_sendgrid_key
```

### Environment-Specific Configuration

Create separate files for different environments:

- `.env.development`
- `.env.staging`
- `.env.production`

---

## Domain Configuration

### Custom Domain Setup

1. **Purchase Domain** from registrar (Namecheap, GoDaddy, etc.)

2. **Configure DNS Records**
   ```
   Type: A
   Name: @
   Value: your_server_ip
   TTL: 3600

   Type: A
   Name: www
   Value: your_server_ip
   TTL: 3600
   ```

3. **Configure in Hosting Platform**
   - Add custom domain in platform settings
   - Verify domain ownership
   - Configure SSL certificates

### Subdomain Configuration

```
Type: A
Name: api
Value: your_server_ip
TTL: 3600
```

---

## SSL/HTTPS Setup

### Free SSL with Let's Encrypt

1. **Install Certbot**
   ```bash
   # Ubuntu/Debian
   apt install certbot python3-certbot-nginx

   # Amazon Linux
   yum install certbot python3-certbot-nginx
   ```

2. **Generate Certificate**
   ```bash
   certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

3. **Auto-renewal**
   ```bash
   # Test renewal
   certbot renew --dry-run

   # Add to crontab
   crontab -e
   # Add: 0 12 * * * certbot renew --quiet
   ```

### Cloud Provider SSL

Most cloud providers offer managed SSL certificates:

- **AWS**: Certificate Manager
- **Google Cloud**: Managed Certificates
- **Azure**: App Service Certificates

---

## Monitoring and Analytics

### Application Monitoring

1. **PM2 Monitoring**
   ```bash
   pm2 install pm2-logrotate
   pm2 install pm2-server-monit
   ```

2. **Health Checks**
   ```bash
   # Create health check endpoint
   curl http://localhost:3001/api/health
   ```

3. **Log Management**
   ```bash
   # View logs
   pm2 logs webcraft-api

   # Monitor performance
   pm2 monit
   ```

### Third-Party Monitoring

1. **New Relic**
   ```bash
   npm install newrelic
   ```

2. **Datadog**
   ```bash
   npm install dd-trace
   ```

3. **Sentry**
   ```bash
   npm install @sentry/node @sentry/react
   ```

### Website Analytics

1. **Google Analytics**
   - Add tracking code to index.html
   - Configure goals and events

2. **Plausible Analytics** (Privacy-focused)
   - Self-hosted or cloud version
   - Lightweight and GDPR compliant

---

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   ```bash
   # Check build logs
   npm run build

   # Clear cache and rebuild
   rm -rf node_modules dist
   npm install
   npm run build
   ```

2. **Port Conflicts**
   ```bash
   # Find process using port
   lsof -i :3001

   # Kill process
   kill -9 <PID>
   ```

3. **Permission Issues**
   ```bash
   # Fix npm permissions
   sudo chown -R $(whoami) ~/.npm

   # Fix file permissions
   chmod -R 755 /var/www/webcraft
   ```

4. **Database Connection Issues**
   ```bash
   # Test database connection
   npm run test:db

   # Check environment variables
   echo $DATABASE_URL
   ```

### Performance Issues

1. **Slow API Responses**
   - Enable gzip compression
   - Implement caching
   - Optimize database queries

2. **High Memory Usage**
   - Monitor with PM2
   - Implement memory limits
   - Optimize code

3. **Static Asset Delivery**
   - Use CDN
   - Enable compression
   - Optimize images

---

## Security Checklist

### Deployment Security

- [ ] Change default passwords
- [ ] Configure firewall rules
- [ ] Enable SSL/HTTPS
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Hide server information
- [ ] Set up monitoring
- [ ] Regular security updates

### Application Security

- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Secure headers
- [ ] Error handling
- [ ] Logging and monitoring

---

## Post-Deployment Checklist

### Immediate Tasks

- [ ] Test all functionality
- [ ] Verify API endpoints
- [ ] Check email notifications
- [ ] Test payment processing
- [ ] Verify SSL certificates
- [ ] Set up monitoring alerts

### Ongoing Maintenance

- [ ] Regular backups
- [ ] Security updates
- [ ] Performance monitoring
- [ ] Log analysis
- [ ] User feedback collection
- [ ] Feature updates

---

**Need Help?** Check the main documentation or create an issue in the repository for deployment support.