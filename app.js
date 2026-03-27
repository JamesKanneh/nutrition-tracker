// NutriTrack - Health & Nutrition Tracker
// Uses Spoonacular API: https://spoonacular.com/food-api

let searchResults = [];
let foodLog = JSON.parse(localStorage.getItem('foodLog')) || [];

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const sortSelect = document.getElementById('sortSelect');
const maxCalories = document.getElementById('maxCalories');
const filterBtn = document.getElementById('filterBtn');
const clearBtn = document.getElementById('clearBtn');
const resultsGrid = document.getElementById('resultsGrid');
const errorMsg = document.getElementById('errorMsg');
const loading = document.getElementById('loading');
const foodLogDiv = document.getElementById('foodLog');
const clearLogBtn = document.getElementById('clearLogBtn');

async function searchFood(query) {
    showLoading(true);
    hideError();
    resultsGrid.innerHTML = '';

    try {
        const response = await fetch(
            `https://api.spoonacular.com/food/ingredients/search?query=${encodeURIComponent(query)}&number=12&apiKey=${API_KEY}`
        );

        if (!response.ok) throw new Error('Failed to fetch data. Please try again.');

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            showError('No results found. Try a different search term.');
            return;
        }

        const nutritionPromises = data.results.map(item => fetchNutrition(item.id, item.name));
        searchResults = await Promise.all(nutritionPromises);
        searchResults = searchResults.filter(item => item !== null);
        displayResults(searchResults);

    } catch (err) {
        showError(err.message || 'Something went wrong. Please check your connection.');
    } finally {
        showLoading(false);
    }
}

async function fetchNutrition(id, name) {
    try {
        const response = await fetch(
            `https://api.spoonacular.com/food/ingredients/${id}/information?amount=100&unit=grams&apiKey=${API_KEY}`
        );
        if (!response.ok) return null;

        const data = await response.json();
        const nutrients = data.nutrition ? data.nutrition.nutrients : [];

        const getVal = (nutrientName) => {
            const n = nutrients.find(n => n.name === nutrientName);
            return n ? Math.round(n.amount) : 0;
        };

        return {
            id,
            name: data.name || name,
            calories: getVal('Calories'),
            protein: getVal('Protein'),
            carbs: getVal('Carbohydrates'),
            fat: getVal('Fat'),
            fiber: getVal('Fiber')
        };
    } catch {
        return null;
    }
}

function displayResults(results) {
    resultsGrid.innerHTML = '';
    if (results.length === 0) {
        showError('No results match your filter criteria.');
        return;
    }
    results.forEach(item => {
        const card = document.createElement('div');
        card.className = 'food-card';
        const itemData = encodeURIComponent(JSON.stringify(item));
        card.innerHTML = `
            <h3>${item.name}</h3>
            <div class="nutrient-row"><span>Calories</span><span>${item.calories} kcal</span></div>
            <div class="nutrient-row"><span>Protein</span><span>${item.protein}g</span></div>
            <div class="nutrient-row"><span>Carbs</span><span>${item.carbs}g</span></div>
            <div class="nutrient-row"><span>Fat</span><span>${item.fat}g</span></div>
            <div class="nutrient-row"><span>Fiber</span><span>${item.fiber}g</span></div>
            <button class="add-btn" data-item="${itemData}">+ Add to Log</button>
        `;
        card.querySelector('.add-btn').addEventListener('click', function() {
            addToLog(JSON.parse(decodeURIComponent(this.dataset.item)));
        });
        resultsGrid.appendChild(card);
    });
}

function addToLog(item) {
    foodLog.push(item);
    localStorage.setItem('foodLog', JSON.stringify(foodLog));
    updateLog();
}

function updateLog() {
    foodLogDiv.innerHTML = '';
    if (foodLog.length === 0) {
        foodLogDiv.innerHTML = '<p style="color:#aaa;text-align:center;padding:20px;">No foods logged yet. Search and add foods above!</p>';
    } else {
        foodLog.forEach((item, index) => {
            const logItem = document.createElement('div');
            logItem.className = 'log-item';
            logItem.innerHTML = `
                <span class="log-item-name">${item.name}</span>
                <span class="log-item-nutrients">${item.calories} kcal | P: ${item.protein}g | C: ${item.carbs}g | F: ${item.fat}g</span>
                <button class="remove-btn" data-index="${index}">Remove</button>
            `;
            logItem.querySelector('.remove-btn').addEventListener('click', function() {
                removeFromLog(parseInt(this.dataset.index));
            });
            foodLogDiv.appendChild(logItem);
        });
    }
    updateTotals();
}

function removeFromLog(index) {
    foodLog.splice(index, 1);
    localStorage.setItem('foodLog', JSON.stringify(foodLog));
    updateLog();
}

function updateTotals() {
    const totals = foodLog.reduce((acc, item) => {
        acc.calories += item.calories;
        acc.protein += item.protein;
        acc.carbs += item.carbs;
        acc.fat += item.fat;
        return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    document.getElementById('totalCalories').textContent = totals.calories;
    document.getElementById('totalProtein').textContent = totals.protein;
    document.getElementById('totalCarbs').textContent = totals.carbs;
    document.getElementById('totalFat').textContent = totals.fat;
}

function applyFilters() {
    let filtered = [...searchResults];
    const maxCal = parseInt(maxCalories.value);
    if (!isNaN(maxCal) && maxCal > 0) {
        filtered = filtered.filter(item => item.calories <= maxCal);
    }
    const sortBy = sortSelect.value;
    filtered.sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return b[sortBy] - a[sortBy];
    });
    displayResults(filtered);
}

function showLoading(show) { loading.classList.toggle('hidden', !show); }
function showError(msg) { errorMsg.textContent = msg; errorMsg.classList.remove('hidden'); }
function hideError() { errorMsg.classList.add('hidden'); }

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) { showError('Please enter a food to search.'); return; }
    searchFood(query);
});

searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchBtn.click(); });
filterBtn.addEventListener('click', applyFilters);
clearBtn.addEventListener('click', () => {
    maxCalories.value = '';
    sortSelect.value = 'name';
    displayResults(searchResults);
});
clearLogBtn.addEventListener('click', () => {
    foodLog = [];
    localStorage.setItem('foodLog', JSON.stringify(foodLog));
    updateLog();
});

updateLog();