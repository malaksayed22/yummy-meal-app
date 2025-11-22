const resultsBox = document.getElementById("results");
const spinner = document.getElementById("spinner");

const showSpinner = () => spinner.classList.remove("d-none");
const hideSpinner = () => spinner.classList.add("d-none");

async function fetchMeals(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        return data.meals || [];
    } catch {
        return [];
    }
}

function renderMeals(meals) {
    resultsBox.innerHTML = "";
    const isInPagesFolder = window.location.pathname.includes('/pages/');
    const mealDetailsPath = isInPagesFolder ? 'mealDetails.html' : 'pages/mealDetails.html';

    meals.forEach(meal => {
        const col = document.createElement('div');
        col.classList.add('col-3');
        col.innerHTML = `
            <div class="card bg-transparent border-0 position-relative overflow-hidden">
                <div class="layer rounded-3 d-flex align-items-center justify-content-center fs-3 fw-bold">${meal.strMeal}</div>
                <img src="${meal.strMealThumb}" class="rounded-3 w-100" alt="${meal.strMeal}">
            </div>
        `;
        
        col.querySelector('.card').onclick = function() {
            window.location.href = `${mealDetailsPath}?id=${meal.idMeal}`;
        };
        
        resultsBox.appendChild(col);
    });
}

async function loadRandomMeals() {
    showSpinner();
    
    const meals = [];
    const seenIds = new Set();
    
    while (meals.length < 20) {
        const result = await fetchMeals('https://www.themealdb.com/api/json/v1/1/random.php');
        const meal = result[0];
        
        if (meal && !seenIds.has(meal.idMeal)) {
            seenIds.add(meal.idMeal);
            meals.push(meal);
        }
    }
    
    hideSpinner();
    renderMeals(meals);
}

document.addEventListener("DOMContentLoaded", loadRandomMeals);
