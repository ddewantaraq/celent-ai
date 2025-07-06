# Mastra + Express.js Deployment Guide

This guide explains how to deploy your Mastra + Express.js application on a VPS using Docker and Docker Compose.

---

## Prerequisites

- A VPS (Ubuntu, Debian, CentOS, etc.) with root or sudo access
- [Docker](https://docs.docker.com/get-docker/) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed
- Git installed (optional, for cloning your repo)

---

## 1. Prepare Your VPS

SSH into your VPS:
```sh
ssh youruser@your-vps-ip
```

Update your package list and install Docker & Docker Compose:
```sh
# For Ubuntu/Debian
sudo apt update
sudo apt install -y docker.io docker-compose

# Start Docker and enable on boot
sudo systemctl start docker
sudo systemctl enable docker
```

---

## 2. Clone Your Project (or Upload Files)

Clone your repository or upload your project files to the VPS:
```sh
git clone https://github.com/yourusername/your-repo.git
cd your-repo
```

---

## 3. Configure Environment Variables (Optional)

If you need to set environment variables (e.g., for database URLs, API keys), edit the `docker-compose.yml` file:

```yaml
    environment:
      - NODE_ENV=production
      - YOUR_ENV_VAR=value
```

Or create a `.env` file and reference it in `docker-compose.yml`:
```yaml
    env_file:
      - .env
```

---

## 4. Build and Start the App

From your project directory (where `docker-compose.yml` is located), run:

```sh
sudo docker compose up --build -d
```

- `--build` ensures the image is rebuilt with any changes.
- `-d` runs the containers in the background (detached mode).

---

## 5. Check Logs and Status

To see logs:
```sh
sudo docker compose logs -f
```

To check running containers:
```sh
sudo docker ps
```

---

## 6. Update and Restart

If you update your code:
```sh
git pull
sudo docker compose up --build -d
```

---

## 7. Stopping the App

To stop the app:
```sh
sudo docker compose down
```

---

## 8. Accessing the App

Your app will be available at:
```
http://your-vps-ip:3000
```

If you want to use a custom domain or SSL, set up a reverse proxy (e.g., Nginx, Caddy) on your VPS.

---

## Notes
- For production, use a persistent database (not in-memory) by updating the storage config and adding a database service to `docker-compose.yml`.
- Adjust the `restart:` policy in `docker-compose.yml` as needed (`always`, `unless-stopped`, etc.).
- Make sure your firewall allows traffic on port 3000 (or your chosen port). 