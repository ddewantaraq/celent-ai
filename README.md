# Celent AI Project

## Monorepo Structure

This project is split into two main repositories:

- **Frontend:** [React / Next.js UI](https://github.com/ilhamdirga22/)
- **Backend + AI:** [Express.js API & Mastra AI](https://github.com/ddewantaraq/celent-ai)

---

## Tech Stack

- **Frontend:** React / Next.js
- **Backend:** Express.js
- **AI Agent:** Mastra AI Framework, Groq API for chat generation, Llama-3.3-70b-versatile as LLM Model
- **MCP Server:** smithery.ai
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Cloud Providers:**
  - Vultr (Backend + AI server)
  - Vercel (UI / Web app server)

---

## Running Locally (with Docker)

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed
- (Optional) Git installed for cloning repositories

### 1. Clone the Backend + AI Repository
```sh
git clone https://github.com/ddewantaraq/celent-ai.git
cd celent-ai
```

### 2. Set Up Environment Variables
- Copy `.env.example` to `.env` and fill in the required values.
- For development, you can use the provided `docker.env` file.

### 3. Start the Backend + AI Locally
```sh
docker compose up --build -d
```
- This will start the backend API, AI agent, and a local database (if configured).
- The backend will be available at `http://localhost:3000` (or your configured port).

### 4. (Optional) Run the Frontend Locally
- Clone the frontend repo: `git clone https://github.com/ilhamdirga22/`
- Follow the frontend repo's README for local setup (typically `npm install && npm run dev`).

---

## Deploying to Cloud

### Backend + AI (Vultr or other VPS)
1. **Provision a VPS** (Ubuntu/Debian recommended)
2. **Install Docker & Docker Compose**
   ```sh
   sudo apt update
   sudo apt install -y docker.io docker-compose
   sudo systemctl start docker
   sudo systemctl enable docker
   ```
3. **Clone the backend repo and set up environment variables**
   ```sh
   git clone https://github.com/ddewantaraq/celent-ai.git
   cd celent-ai
   cp docker.env.example docker.env.prod
   # Edit docker.env.prod with your production values
   ```
4. **Start the app in production mode**
   ```sh
   docker compose -f docker-compose.prod.yml up --build -d
   ```
5. **Check logs and status**
   ```sh
   docker compose -f docker-compose.prod.yml logs -f
   docker ps
   ```
6. **Update and restart**
   ```sh
   git pull
   docker compose -f docker-compose.prod.yml up --build -d
   ```
7. **Stopping the app**
   ```sh
   docker compose -f docker-compose.prod.yml down
   ```

### Frontend (Vercel)
- Deploy the frontend repo to [Vercel](https://vercel.com/) (see their docs for Next.js deployment).
- Set environment variables in the Vercel dashboard as needed.

---

## Notes
- For production, the backend connects to your managed/external database (no local DB container).
- `docker.env.prod` and `docker.env` are both ignored by git for security.
- Adjust the `restart:` policy in `docker-compose.prod.yml` as needed (`always`, `unless-stopped`, etc.).
- Make sure your firewall allows traffic on port 3000 (or your chosen port). 