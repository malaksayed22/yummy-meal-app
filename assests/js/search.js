const nameInput   = document.getElementById("searchInputById");
const letterInput = document.getElementById("searchInputLetter");
const resultsBox  = document.getElementById("results");
const spinner     = document.getElementById("spinner");

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

function renderMeals(meals){
    resultsBox.innerHTML = "";
    const isInPagesFolder = window.location.pathname.includes('/pages/');
    const mealDetailsPath = isInPagesFolder ? 'mealDetails.html' : 'pages/mealDetails.html';

    meals.forEach(meal =>{
        const col = document.createElement('div');
        col.classList.add('col-3');
        col.innerHTML = `
            <div class="card bg-transparent border-0 position-relative overflow-hidden">
                <div class="layer rounded-3 d-flex align-items-center justify-content-center fs-3 fw-bold">${meal.strMeal}</div>
                <a href="${mealDetailsPath}?id=${meal.idMeal}">
                    <img src="${meal.strMealThumb}" class="rounded-3 w-100" alt="${meal.strMeal}">                  
                </a>
            </div>
        `;
        
        col.querySelector('a').onclick = function(e) {
            e.preventDefault();
            window.location.href = this.href;
        };      
        resultsBox.appendChild(col);
    });
}

nameInput.addEventListener("input", async () => {
    const q = nameInput.value.trim();
    showSpinner();

    const meals = await fetchMeals(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`);
    const filtered = meals.filter(m => m.strMeal && m.strMeal.toLowerCase().includes(q.toLowerCase()));

    hideSpinner();
    renderMeals(filtered);
});

letterInput.addEventListener("input", async () => {
    const q = letterInput.value.trim();
    showSpinner();

    const meals = await fetchMeals(
        `https://www.themealdb.com/api/json/v1/1/search.php?f=${q[0]}`
    );

    hideSpinner();
    renderMeals(meals);
});
