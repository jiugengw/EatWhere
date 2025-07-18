# Restaurant Recommendation System

A full-stack application for discovering and rating restaurants with personalized recommendations and group features.

## For Local Development

### 1. Clone this Repository
```bash
git clone <repository-url>
cd where2eat
```

### 2. Start the Backend
Open the first terminal:
```bash
cd server
npm install
npm run dev
```
The backend will start on `http://localhost:8080` and show `mongodb connected`

### 3. Start the Frontend
Open a second terminal:
```bash
cd client
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`

### 4. Access the Application
Visit `http://localhost:5173` in your browser to use the application.

---


## Remote Deployment

### Step 1: Prepare Repositories

You'll need to create **two separate github repositories** - one for frontend and one for backend.

### Step 2: Deploy the Frontend (Vercel)

1. **Create a new repository** for the frontend on GitHub
2. **Prepare the frontend code:**
   ```bash
   cd client
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-frontend-repo-url>
   git branch -M main
   git push -u origin main
   ```
3. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your frontend repository and deploy

### Step 3: Deploy the Backend (Render)

1. **Create a new repository** for the backend on GitHub
2. **Prepare the backend code:**
   ```bash
   cd server
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-backend-repo-url>
   git branch -M main
   git push -u origin main
   ```
3. **Deploy to Render:**
   - Go to [render.com](https://render.com)
   - Create a new Web Service
   - Connect your backend repository
   - Configure build and start commands:
     - **Build Command:** `npm install && npm run build`
     - **Start Command:** `npm start`

