#  NutriTrack — Health & Nutrition Tracker

A multi-page web application for tracking daily food intake and nutrition, powered by the Spoonacular API.

## Pages
- **Home** (`index.html`) — Landing page with app overview
- **Dashboard** (`dashboard.html`) — Today's calorie total, macros, and recent log
- **Search** (`search.html`) — Search foods, sort by nutrients, add to log
- **Details** (`details.html`) — Full nutrition breakdown for a single food
- **Log** (`log.html`) — Full daily food log with totals and remove option

## Features
- Search 1M+ foods via Spoonacular API
- Sort results by calories, protein, carbs, or fat
- Add foods to daily log (persisted in localStorage)
- Dashboard shows today's calorie total and macros at a glance
- Full nutrition details page per food item
- Error handling for API issues (invalid key, quota, network errors)
- Responsive design for mobile and desktop

## Color Scheme
- Forest Green `#2d5016` / `#4a7c2a`
- Black `#0a0a0a`
- Ash Gray `#b0b7b0`

## How to Run Locally
1. Clone the repository
2. Copy `config.example.js` to `config.js`
3. Add your Spoonacular API key to `config.js`
4. Open `index.html` in your browser — no server required!

## Deployment
Deployed on two web servers behind a HAProxy load balancer:

| Server | IP |
|--------|----|
| web-01 | 44.201.170.157 |
| web-02 | 18.212.66.37 |
| Load Balancer | 34.238.43.183 |

### Deployment Steps
1. SSH into each web server
2. Copy all files to `/var/www/html/nutritrack/`
3. HAProxy distributes traffic between web-01 and web-02

## API Credits
- [Spoonacular Food API](https://spoonacular.com/food-api) — Food search and nutrition data
  - Documentation: https://spoonacular.com/food-api/docs

## Security
- API key is stored in `config.js` which is excluded from git via `.gitignore`
- API keys are provided separately in submission comments

## Author
James Kanneh — ALU Web Infrastructure Project 2026