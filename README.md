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

## 3. Development vs. Production Deployment

- **Development:** Uses `docker-compose.yml` and `docker.env` (includes local DB service).
- **Production:** Uses `docker-compose.prod.yml` and `docker.env.prod` (backend app only, connects to your external/managed DB).

---

## 4. Production Environment Variables

For production deployments, set your environment variables in `docker.env.prod`:

```env
NODE_ENV=production
PORT=3000
DB_USER=your_prod_user
DB_PASSWORD=your_prod_password
DB_NAME=your_prod_db
DB_HOST=your_prod_db_host
DB_PORT=your_prod_db_port
```

Update these values to match your production database credentials and host.

---

## 5. Build and Start the App (Production)

From your project directory (where `docker-compose.prod.yml` is located), run:

```sh
docker compose -f docker-compose.prod.yml up --build -d
```

- `--build` ensures the image is rebuilt with any changes.
- `-d` runs the container in the background (detached mode).

---

## 6. Check Logs and Status

To see logs:
```sh
docker compose -f docker-compose.prod.yml logs -f
```

To check running containers:
```sh
docker ps
```

---

## 7. Update and Restart (Production)

If you update your code:
```sh
git pull
docker compose -f docker-compose.prod.yml up --build -d
```

---

## 8. Stopping the App (Production)

To stop the app:
```sh
docker compose -f docker-compose.prod.yml down
```

---

## 9. Accessing the App

Your app will be available at:
```
http://your-vps-ip:3000
```

If you want to use a custom domain or SSL, set up a reverse proxy (e.g., Nginx, Caddy) on your VPS.

---

## Notes
- For production, the backend app connects to your managed/external database (no local DB container).
- `docker.env.prod` and `docker.env` are both ignored by git for security.
- Adjust the `restart:` policy in `docker-compose.prod.yml` as needed (`always`, `unless-stopped`, etc.).
- Make sure your firewall allows traffic on port 3000 (or your chosen port). 