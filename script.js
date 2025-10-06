const URL = 'https://www.themealdb.com/api/json/v1/1';

const searchBar = document.getElementById('searchBar');
const searchButton = document.getElementById('searchButton');
const recipesGrid = document.getElementById('recipesGrid');
const darkModeToggle = document.getElementById('darkModeToggle');
const categoryBtns = document.querySelectorAll('.category-btn');

const recipeModal = document.getElementById('recipeModal');
const modalClose = recipeModal.querySelector('.close');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalArea = document.getElementById('modalArea');
const modalIngredients = document.getElementById('modalIngredients');
const modalInstructions = document.getElementById('modalInstructions');

let currentRecipe = null;

// ✅ Load random recipes on page load
window.onload = () => {
  loadRecipes('all');
};

// ✅ Toggle dark mode
darkModeToggle.onclick = () => {
  document.body.classList.toggle('dark-mode');
};

// ✅ Search by dish name
searchButton.onclick = () => searchRecipes(searchBar.value);
searchBar.addEventListener('keydown', e => {
  if (e.key === 'Enter') searchRecipes(searchBar.value);
});

// ✅ Category filtering
categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    categoryBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadRecipes(btn.dataset.category);
  });
});

// ✅ Close modal
modalClose.onclick = () => (recipeModal.style.display = 'none');
window.onclick = e => {
  if (e.target === recipeModal) recipeModal.style.display = 'none';
};

// ✅ Load recipes (all or by category)
async function loadRecipes(category) {
  recipesGrid.innerHTML = '<p>Loading...</p>';
  let url = '';

  if (category === 'all') url = `${URL}/search.php?s=`;
  else url = `${URL}/filter.php?c=${category}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const meals = data.meals || [];

    recipesGrid.innerHTML = '';

    meals.forEach(meal => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <div class="card-content">
          <h4>${meal.strMeal}</h4>
        </div>
      `;
      card.onclick = () => showRecipeDetails(meal.idMeal);
      recipesGrid.appendChild(card);
    });
  } catch (e) {
    recipesGrid.innerHTML = '<p>Failed to load recipes.</p>';
  }
}

// ✅ Search for recipes by name
async function searchRecipes(query) {
  if (!query) return;
  recipesGrid.innerHTML = '<p>Searching...</p>';
  const url = `${URL}/search.php?s=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const meals = data.meals || [];

    recipesGrid.innerHTML = '';

    if (meals.length === 0) {
      recipesGrid.innerHTML = '<p>No recipes found.</p>';
      return;
    }

    meals.forEach(meal => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <div class="card-content">
          <h4>${meal.strMeal}</h4>
        </div>
      `;
      card.onclick = () => showRecipeDetails(meal.idMeal);
      recipesGrid.appendChild(card);
    });
  } catch (e) {
    recipesGrid.innerHTML = '<p>Error searching recipes.</p>';
  }
}

// ✅ Show recipe details in modal
async function showRecipeDetails(id) {
  const url = `${URL}/lookup.php?i=${id}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const meal = data.meals[0];
    currentRecipe = meal;

    modalImage.src = meal.strMealThumb;
    modalTitle.innerText = meal.strMeal;
    modalCategory.innerText = `Category: ${meal.strCategory}`;
    modalArea.innerText = `Cuisine: ${meal.strArea}`;
    modalIngredients.innerHTML = '';

    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ing && ing.trim() !== '') {
        modalIngredients.innerHTML += `<li>${measure} ${ing}</li>`;
      }
    }

    modalInstructions.innerText = meal.strInstructions;
    recipeModal.style.display = 'block';
  } catch (e) {
    alert('Failed to load recipe details.');
  }
}
