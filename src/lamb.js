// Document Ready
document.addEventListener('DOMContentLoaded', () => {
    const mealContainer = document.getElementById('meal-container');
    const modal = document.getElementById('meal-modal');
    const modalImg = document.getElementById('modal-meal-img');
    const modalName = document.getElementById('modal-meal-name');
    const modalOrigin = document.getElementById('modal-meal-origin');
    const modalIngredients = document.getElementById('modal-meal-ingredients');
    const modalInstructions = document.getElementById('modal-meal-instructions');
    const modalUrl = document.getElementById('modal-meal-url');
    const closeModal = document.getElementsByClassName('close')[0];

    // Close modal
    closeModal.onclick = function() {
        modal.style.display = 'none';
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Fetch and display miscellaneous dishes
    function fetchAndDisplayMiscellaneousDishes() {
        fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Miscellaneous')
            .then(response => {
                console.log('API Response:', response); // Debugging
                return response.json();
            })
            .then(data => {
                console.log('API Data:', data); // Debugging
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
                console.error('Error fetching miscellaneous dishes:', error);
            });
    }

    // Fetch and display meal details by ID
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

                modalName.textContent = meal.strMeal;
                modalOrigin.textContent = meal.strArea || 'Unknown';
                modalImg.src = meal.strMealThumb;
                modalImg.alt = meal.strMeal;

                // Clear previous ingredients
                modalIngredients.innerHTML = '';
                for (let i = 1; i <= 20; i++) {
                    let ingredient = meal['strIngredient' + i];
                    let measure = meal['strMeasure' + i];
                    if (ingredient && ingredient.trim() !== '') {
                        let listItem = document.createElement('li');
                        listItem.textContent = measure + ' ' + ingredient;
                        modalIngredients.appendChild(listItem);
                    } else {
                        break; // Exit loop if no more ingredients
                    }
                }

                // Clear previous instructions
                modalInstructions.innerHTML = '';
                if (meal.strInstructions) {
                    modalInstructions.innerHTML = meal.strInstructions.split('\n').map(step => `<li class="step">${step}</li>`).join('');
                } else {
                    modalInstructions.textContent = 'No instructions available.';
                }

                modalUrl.href = meal.strYoutube || '#'; // Use # if no YouTube link available
                modalUrl.textContent = meal.strYoutube ? 'Watch how to prepare on YouTube' : 'No video available';

                // Show modal with meal details
                modal.style.display = 'block';
            })
            .catch(error => {
                console.error('Error fetching meal details:', error);
            });
    }

    // Toggle favorite status
    function toggleFavorite(icon, meal) {
        // Check if the meal is already favorited
        const isFavorited = icon.classList.contains('favorited');

        if (isFavorited) {
            // Remove from favorites
            icon.classList.remove('favorited');
            removeFavorite(meal.idMeal);
        } else {
            // Add to favorites
            icon.classList.add('favorited');
            addFavorite(meal);
        }
    }

    // Add a meal to favorites (e.g., local storage)
    function addFavorite(meal) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (!favorites.some(fav => fav.idMeal === meal.idMeal)) {
            favorites.push(meal);
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    }

    // Remove a meal from favorites (e.g., local storage)
    function removeFavorite(mealId) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites = favorites.filter(fav => fav.idMeal !== mealId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    // Call the function to fetch and display miscellaneous dishes when the page loads
    fetchAndDisplayMiscellaneousDishes();
});
