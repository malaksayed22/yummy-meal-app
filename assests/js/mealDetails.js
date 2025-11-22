async function fetchMealById(id) {
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(id)}`);
        const data = await res.json();
        return data.meals ? data.meals[0] : null;
    } catch {
        return null;
    }
}
function renderMealDetails(meal) {
    
    document.getElementById("mealImage").src = meal.strMealThumb;
    document.getElementById("mealImage").alt = meal.strMeal;
    document.getElementById("mealTitle").textContent = meal.strMeal;
    document.getElementById("mealInstructions").textContent = meal.strInstructions;
    document.getElementById("mealArea").textContent = meal.strArea;
    document.getElementById("mealCategory").textContent = meal.strCategory;
    document.getElementById("mealTags").textContent = meal.strTags;
    document.getElementById("mealSource").href = meal.strSource;
    document.getElementById("mealYoutube").href = meal.strYoutube;

    const ingredientsList = document.getElementById("mealIngredients");
    ingredientsList.innerHTML = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            const li = document.createElement("li");
            li.style.cssText = "display:inline-block; background-color:lightblue; color:black; padding:8px; margin:4px; border-radius:4px;";
            li.textContent = `${measure ? measure : ''} ${ingredient}`.trim();
            ingredientsList.appendChild(li);
        }
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const mealId = urlParams.get("id");
    if (mealId) {
        const meal = await fetchMealById(mealId);
        renderMealDetails(meal);
    }
});