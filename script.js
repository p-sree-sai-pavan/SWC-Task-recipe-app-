const CONFIG = {
  BASE_URL: 'https://www.themealdb.com/api/json/v1/1',
  DEFAULT_RECIPE_COUNT: 12
};

let currentRecipe = null;
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')||'[]');
let favorites = JSON.parse(localStorage.getItem('favorites')||'[]');
let shoppingList = JSON.parse(localStorage.getItem('shoppingList')||'[]');


const searchBar = document.getElementById('searchBar');
const searchButton = document.getElementById('searchButton');
const recipesGrid = document.getElementById('recipesGrid');
const favoritesGrid = document.getElementById('favoritesGrid');
const shoppingListContent = document.getElementById('shoppingListContent');

const favoritesBtn = document.getElementById('favoritesBtn');
const shoppingListBtn = document.getElementById('shoppingListBtn');
const darkModeToggle = document.getElementById('darkModeToggle');

const homeView = document.getElementById('homeView');
const favoritesView = document.getElementById('favoritesView');
const shoppingListView = document.getElementById('shoppingListView');

const recipeModal = document.getElementById('recipeModal');
const modalClose = recipeModal.querySelector('.close');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalArea = document.getElementById('modalArea');
const modalIngredients = document.getElementById('modalIngredients');
const modalInstructions = document.getElementById('modalInstructions');
const saveFavoriteBtn = document.getElementById('saveFavorite');
const addToShoppingListBtn = document.getElementById('addToShoppingList');

const categoryBtns = document.querySelectorAll('.category-btn');

window.onload = () => {
  loadRecipes('all');
  updateCounters();
};

darkModeToggle.onclick = () => {
  document.body.classList.toggle('dark-mode');
};

favoritesBtn.onclick = ()=>showView('favorites');
shoppingListBtn.onclick = ()=>showView('shopping');

searchButton.onclick = ()=>searchRecipes(searchBar.value);
searchBar.addEventListener('keydown', e=>{if(e.key==='Enter') searchRecipes(searchBar.value);});

categoryBtns.forEach(btn => {
  btn.addEventListener('click', ()=>{
    categoryBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    loadRecipes(btn.dataset.category);
  });
});

modalClose.onclick = ()=>recipeModal.style.display='none';
window.onclick = e=>{if(e.target===recipeModal) recipeModal.style.display='none';};

async function loadRecipes(category){
  recipesGrid.innerHTML = '<p>Loading...</p>';
  let url = '';
  if(category==='all') url=`${CONFIG.BASE_URL}/search.php?s=`;
  else url=`${CONFIG.BASE_URL}/filter.php?c=${category}`;
  try{
    const res = await fetch(url);
    const data = await res.json();
    recipesGrid.innerHTML='';
    const meals = data.meals || [];
    meals.forEach(meal=>{
      const card = document.createElement('div');
      card.className='card';
      card.innerHTML=`<img src="${meal.strMealThumb}" alt="${meal.strMeal}"><div class="card-content"><h4>${meal.strMeal}</h4></div>`;
      card.onclick = ()=>showRecipeDetails(meal.idMeal);
      recipesGrid.appendChild(card);
    });
  }catch(e){recipesGrid.innerHTML='<p>Failed to load recipes.</p>';}
}

async function searchRecipes(query){
  if(!query) return;
  recipesGrid.innerHTML='<p>Searching...</p>';
  const url = `${CONFIG.BASE_URL}/search.php?s=${encodeURIComponent(query)}`;
  try{
    const res = await fetch(url);
    const data = await res.json();
    recipesGrid.innerHTML='';
    const meals = data.meals || [];
    if(meals.length===0){recipesGrid.innerHTML='<p>No recipes found.</p>'; return;}
    meals.forEach(meal=>{
      const card = document.createElement('div');
      card.className='card';
      card.innerHTML=`<img src="${meal.strMealThumb}" alt="${meal.strMeal}"><div class="card-content"><h4>${meal.strMeal}</h4></div>`;
      card.onclick = ()=>showRecipeDetails(meal.idMeal);
      recipesGrid.appendChild(card);
    });
  }catch(e){recipesGrid.innerHTML='<p>Error searching recipes.</p>';}
}

async function showRecipeDetails(id){
  const url = `${CONFIG.BASE_URL}/lookup.php?i=${id}`;
  try{
    const res = await fetch(url);
    const data = await res.json();
    const meal = data.meals[0];
    currentRecipe = meal;
    modalImage.src = meal.strMealThumb;
    modalTitle.innerText = meal.strMeal;
    modalCategory.innerText = `Category: ${meal.strCategory}`;
    modalArea.innerText = `Cuisine: ${meal.strArea}`;
    modalIngredients.innerHTML='';
    for(let i=1;i<=20;i++){
      const ing = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if(ing) modalIngredients.innerHTML+=`<li>${measure} ${ing}</li>`;
    }
    modalInstructions.innerText = meal.strInstructions;
    recipeModal.style.display='block';
  }catch(e){alert('Failed to load recipe details.');}
}

saveFavoriteBtn.onclick = ()=>{
  if(!currentRecipe) return;
  const index = favorites.findIndex(f=>f.id===currentRecipe.idMeal);
  if(index>-1) favorites.splice(index,1);
  else favorites.push({id:currentRecipe.idMeal,title:currentRecipe.strMeal,thumb:currentRecipe.strMealThumb});
  localStorage.setItem('favorites',JSON.stringify(favorites));
  updateCounters();
  loadFavorites();
};

function loadFavorites(){
  favoritesView.style.display='block';
  favoritesGrid.innerHTML='';
  if(favorites.length===0){favoritesGrid.innerHTML='<p>No favorites yet.</p>'; return;}
  favorites.forEach(fav=>{
    const card = document.createElement('div');
    card.className='card';
    card.innerHTML=`<img src="${fav.thumb}" alt="${fav.title}"><div class="card-content"><h4>${fav.title}</h4></div>`;
    card.onclick = ()=>showRecipeDetails(fav.id);
    favoritesGrid.appendChild(card);
  });
}

addToShoppingListBtn.onclick = ()=>{
  if(!currentRecipe) return;
  for(let i=1;i<=20;i++){
    const ing=currentRecipe[`strIngredient${i}`];
    const measure=currentRecipe[`strMeasure${i}`];
    if(ing) shoppingList.push({id:Date.now()+Math.random(),item:`${measure} ${ing}`,recipe:currentRecipe.strMeal,completed:false});
  }
  localStorage.setItem('shoppingList',JSON.stringify(shoppingList));
  updateCounters();
  loadShoppingList();
};

function loadShoppingList(){
  shoppingListContent.innerHTML='';
  if(shoppingList.length===0){shoppingListContent.innerHTML='<p>Empty shopping list.</p>'; return;}
  shoppingList.forEach(item=>{
    const div=document.createElement('div');
    div.innerHTML=`<label><input type="checkbox" ${item.completed?'checked':''} onchange="toggleShoppingItem('${item.id}')">${item.item} (from ${item.recipe})</label> <button onclick="removeShoppingItem('${item.id}')">×</button>`;
    shoppingListContent.appendChild(div);
  });
}

window.toggleShoppingItem=id=>{
  const item=shoppingList.find(i=>i.id==id);
  if(item) item.completed=!item.completed;
  localStorage.setItem('shoppingList',JSON.stringify(shoppingList));
  loadShoppingList();
};

window.removeShoppingItem=id=>{
  shoppingList=shoppingList.filter(i=>i.id!=id);
  localStorage.setItem('shoppingList',JSON.stringify(shoppingList));
  loadShoppingList();
};

document.getElementById('clearShoppingList').onclick=()=>{
  shoppingList=[];
  localStorage.setItem('shoppingList',JSON.stringify(shoppingList));
  loadShoppingList();
};

document.getElementById('exportShoppingList').onclick=()=>{
  const text=shoppingList.map(i=>i.item).join('\n');
  const blob=new Blob([text],{type:'text/plain'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url; a.download='shopping_list.txt'; a.click();
  URL.revokeObjectURL(url);
};

function updateCounters(){
  document.getElementById('favoritesCount').innerText=favorites.length;
  document.getElementById('shoppingCount').innerText=shoppingList.length;
}

function showView(view){
  homeView.style.display='none';
  favoritesView.style.display='none';
  shoppingListView.style.display='none';
  if(view==='favorites'){favoritesView.style.display='block'; loadFavorites();}
  else if(view==='shopping'){shoppingListView.style.display='block'; loadShoppingList();}
  else homeView.style.display='block';
}