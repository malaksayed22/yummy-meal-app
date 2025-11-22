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

function renderAreas(areas) {
    resultsBox.innerHTML = "";
    
    areas.forEach(area => {
        const col = document.createElement('div');
        col.classList.add('col-3');
        col.innerHTML = `
            <div class="card bg-transparent border-0 position-relative overflow-hidden rounded-3" style="min-height: 250px; background-color: #333;">
                <div class="d-flex flex-column align-items-center justify-content-center h-100 text-white">
                    <i class="fa-solid fa-house fa-5x mb-3"></i>
                    <h4>${area.strArea}</h4>
                </div>
            </div>
        `;
        
        col.querySelector('.card').onclick = function() {
            loadMealsByArea(area.strArea);
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

async function loadAreas() {
    showSpinner();
    const data = await fetchData('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    hideSpinner();
    
    if (data && data.meals) {
        renderAreas(data.meals);
    }
}

async function loadMealsByArea(areaName) {
    showSpinner();
    const data = await fetchData(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(areaName)}`);
    hideSpinner();
    
    if (data && data.meals) {
        renderMeals(data.meals);
    }
}

document.addEventListener("DOMContentLoaded", loadAreas);
