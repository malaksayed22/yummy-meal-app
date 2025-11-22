const resultsBox = document.getElementById("results");
const spinner = document.getElementById("spinner");

const showSpinner = () => spinner.classList.remove("d-none");
const hideSpinner = () => spinner.classList.add("d-none");

async function fetchData(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        return data;
    } catch {
        return null;
    }
}

function renderIngredients(ingredients) {
    resultsBox.innerHTML = "";
    
    ingredients.forEach(ingredient => {
        const col = document.createElement('div');
        col.classList.add('col-3');
        const shortDesc = ingredient.strDescription ? ingredient.strDescription.slice(0, 80) + '...' : '';
        col.innerHTML = `
            <div class="card bg-transparent border-0 position-relative overflow-hidden rounded-3" style="min-height: 250px; background-color: #333;">
                <div class="d-flex flex-column align-items-center justify-content-center h-100 text-white p-3 text-center">
                    <i class="fa-solid fa-drumstick-bite fa-4x mb-3"></i>
                    <h5>${ingredient.strIngredient}</h5>
                    <p class="small mt-2">${shortDesc}</p>
                </div>
            </div>
        `;
        
        col.querySelector('.card').onclick = function() {
            loadMealsByIngredient(ingredient.strIngredient);
        };
        
        resultsBox.appendChild(col);
    });
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

async function loadIngredients() {
    showSpinner();
    const data = await fetchData('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
    hideSpinner();
    
    if (data && data.meals) {
        renderIngredients(data.meals);
    }
}

async function loadMealsByIngredient(ingredientName) {
    showSpinner();
    const data = await fetchData(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredientName)}`);
    hideSpinner();
    
    if (data && data.meals) {
        renderMeals(data.meals);
    }
}

// Load ingredients on page load
document.addEventListener("DOMContentLoaded", loadIngredients);
