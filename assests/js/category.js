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

function renderCategories(categories) {
    resultsBox.innerHTML = "";
    
    categories.forEach(category => {
        const col = document.createElement('div');
        col.classList.add('col-3');
        const shortDesc = category.strCategoryDescription.slice(0, 100) + '...';
        col.innerHTML = `
            <div class="card bg-transparent border-0 position-relative overflow-hidden">
                <div class="layer rounded-3 d-flex flex-column align-items-center justify-content-center p-3 text-center">
                    <h5 class="fw-bold mb-2">${category.strCategory}</h5>
                    <p class="small">${shortDesc}</p>
                </div>
                <img src="${category.strCategoryThumb}" class="rounded-3 w-100" alt="${category.strCategory}">
            </div>
        `;
        
        col.querySelector('.card').onclick = function() {
            loadMealsByCategory(category.strCategory);
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

async function loadCategories() {
    showSpinner();
    const data = await fetchData('https://www.themealdb.com/api/json/v1/1/categories.php');
    hideSpinner();
    
    if (data && data.categories) {
        renderCategories(data.categories);
    }
}

async function loadMealsByCategory(categoryName) {
    showSpinner();
    const data = await fetchData(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(categoryName)}`);
    hideSpinner();
    
    if (data && data.meals) {
        renderMeals(data.meals);
    }
}

document.addEventListener("DOMContentLoaded", loadCategories);
