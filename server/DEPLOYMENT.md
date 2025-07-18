# AWS CodeDeploy Docker Deployment Guide

## Prerequisites

### 1. EC2 Instance Setup
- Launch an Amazon Linux 2 EC2 instance with at least 2GB RAM
- Install the CodeDeploy agent:
```bash
sudo yum update -y
sudo yum install -y ruby wget
cd /home/ec2-user
wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto
```

### 2. IAM Roles

#### EC2 Instance Role (attach to your EC2 instance):
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::your-deployment-bucket",
                "arn:aws:s3:::your-deployment-bucket/*"
            ]
        }
    ]
}
```

#### CodeDeploy Service Role:
- Use the AWS managed policy: `AWSCodeDeployRole`

### 3. Environment Variables
Create a `.env` file on your EC2 instance at `/home/ec2-user/EatWhere/server/.env`:
```
NODE_ENV=production
PORT=8080
DATABASE=your_mongodb_connection_string
DATABASE_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
# Add other environment variables as needed
```

## Deployment Process

### 1. Create CodeDeploy Application
```bash
aws deploy create-application \
    --application-name eatwhere-server \
    --compute-platform Server
```

### 2. Create Deployment Group
```bash
aws deploy create-deployment-group \
    --application-name eatwhere-server \
    --deployment-group-name production \
    --service-role-arn arn:aws:iam::YOUR-ACCOUNT:role/CodeDeployRole \
    --ec2-tag-filters Key=Name,Value=eatwhere-server,Type=KEY_AND_VALUE
```

### 3. Package and Deploy
```bash
# Create deployment package (excluding large directories)
zip -r eatwhere-server.zip . -x "node_modules/*" "*.git*" "dist/*"

# Upload to S3
aws s3 cp eatwhere-server.zip s3://your-deployment-bucket/

# Create deployment
aws deploy create-deployment \
    --application-name eatwhere-server \
    --deployment-group-name production \
    --s3-location bucket=your-deployment-bucket,key=eatwhere-server.zip,bundleType=zip
```

## Files Overview

- `appspec.yml`: Defines the deployment process and lifecycle hooks
- `Dockerfile`: Defines the Docker image for the application
- `docker-compose.yml`: Docker Compose configuration for easier management
- `scripts/install_docker.sh`: Installs Docker and Docker Compose
- `scripts/stop_container.sh`: Stops and removes the Docker container
- `scripts/build_image.sh`: Builds the Docker image
- `scripts/start_container.sh`: Starts the Docker container
- `scripts/validate_container.sh`: Validates the container deployment

## Monitoring

After deployment, you can monitor your application using:
```bash
# Check container status
docker ps

# View container logs
docker logs eatwhere-server

# Follow logs in real-time
docker logs -f eatwhere-server

# Check container resource usage
docker stats eatwhere-server

# Using Docker Compose (alternative)
docker-compose ps
docker-compose logs -f
```

## Manual Container Management

If you need to manage the container manually:
```bash
# Stop and restart container
docker stop eatwhere-server
docker start eatwhere-server

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Execute commands inside container
docker exec -it eatwhere-server /bin/sh

# View container details
docker inspect eatwhere-server
```

## Troubleshooting

- Check CodeDeploy logs: `/var/log/aws/codedeploy-agent/`
- Check Docker daemon: `sudo systemctl status docker`
- Check container logs: `docker logs eatwhere-server`
- Check if port is listening: `netstat -tuln | grep 8080`
- Check Docker images: `docker images`
- Check container status: `docker ps -a`
