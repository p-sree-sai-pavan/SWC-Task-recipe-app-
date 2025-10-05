# Recipe Finder 🍳

A lightweight client-side recipe discovery app that uses TheMealDB to browse, search, and save recipes. It's built with plain HTML, CSS and JavaScript so you can open [index.html](index.html) in a browser and start using it.

## Files
- [index.html](index.html) — App shell and UI.
- [style.css](style.css) — Styling and dark-mode rules.
- [config.js](config.js) — API configuration (BASE_URL, DEFAULT_RECIPE_COUNT).
- [script.js](script.js) — Main app logic and state.

## Features
- Browse recipes by category (All, Breakfast, Beef, Chicken, Dessert, Seafood).
- Search recipes by name.
- View recipe details (image, ingredients, instructions).
- Save and remove favorites (persisted to localStorage).
- Add ingredients to a shopping list, mark items as completed, export or clear the list.
- Dark mode toggle and simple responsive layout.

## Quick Start
1. Open [config.js](config.js) and confirm the API BASE_URL is correct for TheMealDB.
2. Open [index.html](index.html) in your web browser.
3. Use the search bar or category buttons to load recipes.

## Important Script APIs
The app behavior is implemented in [script.js](script.js). Key functions and handlers:
- [`loadRecipes`](script.js) — load recipes by category.
- [`searchRecipes`](script.js) — search for recipes by query.
- [`showRecipeDetails`](script.js) — fetch and display recipe details in the modal.
- [`saveFavoriteBtn`](script.js) — favorites toggle handler.
- [`addToShoppingListBtn`](script.js) — add current recipe ingredients to shopping list.
- [`loadFavorites`](script.js) — render favorites view.
- [`loadShoppingList`](script.js) — render shopping list.
- [`toggleShoppingItem`](script.js) — toggle shopping item completion.
- [`removeShoppingItem`](script.js) — remove item from shopping list.
- [`updateCounters`](script.js) — refresh favorites/shopping counters.
- [`showView`](script.js) — switch between Home / Favorites / Shopping views.

(Open any of the above names to inspect the implementation in [script.js](script.js).)

## Persistence
Favorites, shoppingList and searchHistory are persisted in localStorage so your data remains between sessions.

## Notes & Tips
- TheMealDB may return different fields for filtered vs. full recipe endpoints; the app uses lookup calls to populate full ingredient lists.
- If a recipe modal shows incomplete ingredient text, check the returned `strIngredientN` / `strMeasureN` fields in [script.js](script.js).
- For styling tweaks, edit [style.css](style.css).

## License
MIT — feel free to reuse and adapt for learning and development.