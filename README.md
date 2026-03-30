#  NutriTrack — Health & Nutrition Tracker

A multi-page web application for tracking daily food intake and nutrition, powered by the Spoonacular API.

## Live Demo
- **GitHub Pages:** https://jameskanneh.github.io/nutrition-tracker/
- **Web Server 1:** http://44.201.170.157/nutritrack/index.html
- **Web Server 2:** http://18.212.66.37/nutritrack/index.html
- **Load Balancer:** http://34.238.43.183/nutritrack/index.html

## Pages
- **Home** (`index.html`) — Landing page with app overview
- **Dashboard** (`dashboard.html`) — Today's calorie total, progress bar, macros, and recent log
- **Search** (`search.html`) — Search foods, sort by nutrients, add to log
- **Details** (`details.html`) — Full nutrition breakdown for a single food
- **Log** (`log.html`) — Full daily food log with totals and remove option

## Features
-  Search 1M+ foods via Spoonacular API
-  Daily calorie goal with progress bar
- ↕ Sort results by calories, protein, carbs, or fat
-  Add foods to daily log (persisted in localStorage)
-  Full nutrition details per food item
-  Error handling for API issues (invalid key, quota, network errors)
-  Responsive design for mobile and desktop

## Color Scheme
- Forest Green `#2d5016` / `#4a7c2a`
- Black `#0a0a0a`
- Ash Gray `#b0b7b0`

## How to Run Locally
1. Clone the repository:
```bash
git clone https://github.com/JamesKanneh/nutrition-tracker.git
cd nutrition-tracker
```
2. Open `index.html` directly in your browser, OR run a local server:
```bash
python3 -m http.server 8000
```
3. Visit `http://localhost:8000`

## API Key
The API key is included in `config.js`. For security in production, this should be moved to a backend server. The key used is for the Spoonacular API free tier.

## Deployment
The app is deployed on two Ubuntu web servers behind a HAProxy load balancer.

| Server | IP | URL |
|--------|----|-----|
| web-01 | 44.201.170.157 | http://44.201.170.157/nutritrack/ |
| web-02 | 18.212.66.37 | http://18.212.66.37/nutritrack/ |
| Load Balancer | 34.238.43.183 | http://34.238.43.183/nutritrack/ |

### Deployment Steps
1. SSH into each web server
2. Create directory: `sudo mkdir -p /var/www/html/nutritrack`
3. Copy files via scp: `scp -i ~/.ssh/school *.html *.css *.js ubuntu@SERVER_IP:/var/www/html/nutritrack/`
4. HAProxy on lb-01 distributes traffic between web-01 and web-02 using round-robin

### Load Balancer Configuration
HAProxy is configured at `/etc/haproxy/haproxy.cfg` with:
- Round-robin load balancing between web-01 and web-02
- HTTP to HTTPS redirect
- SSL termination using Let's Encrypt certificate

## API Credits
- [Spoonacular Food API](https://spoonacular.com/food-api) — Food search and nutrition data
  - Documentation: https://spoonacular.com/food-api/docs
  - Free tier: 150 requests/day

## Security Note
The API key is exposed in `config.js` for this student project deployment. In a production environment, API calls should be proxied through a backend server to keep the key secure.

## Author
James Kanneh — ALU Web Infrastructure & API Project 2026