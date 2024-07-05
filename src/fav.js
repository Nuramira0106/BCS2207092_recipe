document.addEventListener('DOMContentLoaded', () => {
    displayFavorites();
    
    // Set up event listeners for the update form buttons
    document.getElementById('save-update').addEventListener('click', saveUpdate);
    document.getElementById('cancel-update').addEventListener('click', cancelUpdate);
});

function displayFavorites() {
    const mealContainer = document.getElementById('meal-container');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const updateForm = document.getElementById('update-form');
    
    if (favorites.length === 0) {
        mealContainer.innerHTML = '<p>No favorite meals found.</p>';
        return;
    }

    mealContainer.innerHTML = ''; // Clear container before appending
    favorites.forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.classList.add('meal-card');

        const mealImg = document.createElement('img');
        mealImg.src = meal.strMealThumb;
        mealImg.alt = meal.strMeal;

        const mealName = document.createElement('div');
        mealName.classList.add('meal-name');
        mealName.textContent = meal.strMeal;

        // Create update button
        const updateBtn = document.createElement('button');
        updateBtn.classList.add('update-btn');
        updateBtn.innerHTML = '<i class="fa fa-pencil"></i>'; // Pencil icon
        updateBtn.addEventListener('click', () => showUpdateForm(meal));

        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerHTML = '<i class="fa fa-trash"></i>'; // Trash icon
        deleteBtn.addEventListener('click', () => deleteFavorite(meal.idMeal));

        mealCard.appendChild(mealImg);
        mealCard.appendChild(mealName);
        mealCard.appendChild(updateBtn);
        mealCard.appendChild(deleteBtn);
        mealContainer.appendChild(mealCard);
    });
}

function deleteFavorite(mealId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(meal => meal.idMeal !== mealId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites(); // Refresh the list
}

function showUpdateForm(meal) {
    document.getElementById('update-meal-id').value = meal.idMeal;
    document.getElementById('update-meal-name').value = meal.strMeal;
    document.getElementById('update-meal-img').value = meal.strMealThumb;
    document.getElementById('update-form').style.display = 'block';
}

function saveUpdate() {
    const mealId = document.getElementById('update-meal-id').value;
    const mealName = document.getElementById('update-meal-name').value;
    const mealImg = document.getElementById('update-meal-img').value;

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.map(meal => {
        if (meal.idMeal === mealId) {
            return { ...meal, strMeal: mealName, strMealThumb: mealImg };
        }
        return meal;
    });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    document.getElementById('update-form').style.display = 'none';
    displayFavorites(); // Refresh the list
}

function cancelUpdate() {
    document.getElementById('update-form').style.display = 'none';
}
