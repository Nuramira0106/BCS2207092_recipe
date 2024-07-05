// Function to fetch and display starter dishes
function fetchAndDisplayStarterDishes() {
    fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Starter')
        .then(response => {
            console.log('API Response:', response); // Debugging
            return response.json();
        })
        .then(data => {
            console.log('API Data:', data); // Debugging
            const mealContainer = document.getElementById('meal-container');
            mealContainer.innerHTML = ''; // Clear container before adding new meals

            // Retrieve favorite meals from local storage
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

            data.meals.forEach(meal => {
                const mealCard = document.createElement('div');
                mealCard.classList.add('meal-card');

                const mealImg = document.createElement('img');
                mealImg.src = meal.strMealThumb;
                mealImg.alt = meal.strMeal;

                const mealName = document.createElement('div');
                mealName.classList.add('meal-name');
                mealName.textContent = meal.strMeal;

                // Create and add the favorite icon
                const favoriteIcon = document.createElement('i');
                favoriteIcon.classList.add('fa', 'fa-heart', 'favorite-icon');

                // Check if the meal is already favorited and update the icon
                if (favorites.some(fav => fav.idMeal === meal.idMeal)) {
                    favoriteIcon.classList.add('favorited');
                }

                favoriteIcon.addEventListener('click', function(event) {
                    event.stopPropagation(); // Prevent the meal card click event
                    toggleFavorite(favoriteIcon, meal);
                });

                // Add click event to show meal details
                mealCard.addEventListener('click', function() {
                    console.log('Fetching details for meal ID:', meal.idMeal); // Debugging
                    fetchAndShowMealDetails(meal.idMeal);
                });

                mealCard.appendChild(mealImg);
                mealCard.appendChild(mealName);
                mealCard.appendChild(favoriteIcon);
                mealContainer.appendChild(mealCard);
            });
        })
        .catch(error => {
            console.error('Error fetching starter dishes:', error);
        });
}

// Function to fetch and display meal details by ID
function fetchAndShowMealDetails(mealId) {
    fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + mealId)
        .then(response => {
            console.log('Meal Detail API Response:', response); // Debugging
            return response.json();
        })
        .then(data => {
            console.log('Meal Detail API Data:', data); // Debugging
            const meal = data.meals[0];

            if (!meal) {
                console.error('No meal data found');
                return;
            }

            const mealNameElem = document.getElementById('meal-name');
            const mealOriginElem = document.getElementById('meal-origin');
            const mealImgElem = document.getElementById('meal-img');
            const mealIngredientsElem = document.getElementById('meal-ingredients');
            const mealInstructionsElem = document.getElementById('meal-instructions');
            const mealUrlElem = document.getElementById('meal-url');

            mealNameElem.textContent = meal.strMeal;
            mealOriginElem.textContent = meal.strArea || 'Unknown';
            mealImgElem.src = meal.strMealThumb;

            // Clear previous ingredients
            mealIngredientsElem.innerHTML = '';
            for (let i = 1; i <= 20; i++) {
                let ingredient = meal['strIngredient' + i];
                let measure = meal['strMeasure' + i];
                if (ingredient && ingredient.trim() !== '') {
                    let listItem = document.createElement('li');
                    listItem.textContent = measure + ' ' + ingredient;
                    mealIngredientsElem.appendChild(listItem);
                } else {
                    break; // Exit loop if no more ingredients
                }
            }

            // Clear previous instructions
            mealInstructionsElem.innerHTML = '';
            let instructions = meal.strInstructions.split('\n');
            instructions.forEach((instruction, index) => {
                if (instruction.trim() !== '') {
                    let listItem = document.createElement('li');
                    listItem.classList.add('step');
                    listItem.textContent = instruction.trim();
                    mealInstructionsElem.appendChild(listItem);
                }
            });

            mealUrlElem.href = meal.strYoutube || '#'; // Use # if no YouTube link available

            // Show modal with meal details
            openModal();
        })
        .catch(error => {
            console.error('Error fetching meal details:', error);
        });
}

// Function to open the modal
function openModal() {
    var modal = document.getElementById('myModal');
    modal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
    var modal = document.getElementById('myModal');
    modal.style.display = 'none';
}

// Event listener for the close button in the modal
document.getElementsByClassName('close')[0].addEventListener('click', closeModal);

// Event listener for clicks outside the modal to close it
window.addEventListener('click', function(event) {
    var modal = document.getElementById('myModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Function to toggle the favorite status
function toggleFavorite(icon, meal) {
    // Check if the meal is already favorited
    const isFavorited = icon.classList.contains('favorited');
    
    if (isFavorited) {
        // Remove from favorites
        icon.classList.remove('favorited');
        // Optionally remove from local storage or a favorites list
        removeFavorite(meal.idMeal);
    } else {
        // Add to favorites
        icon.classList.add('favorited');
        // Optionally add to local storage or a favorites list
        addFavorite(meal);
    }
}

// Function to add a meal to favorites (e.g., local storage)
function addFavorite(meal) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.some(fav => fav.idMeal === meal.idMeal)) {
        favorites.push(meal);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

// Function to remove a meal from favorites (e.g., local storage)
function removeFavorite(mealId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.idMeal !== mealId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Call the function to fetch and display starter dishes when the page loads
fetchAndDisplayStarterDishes();
