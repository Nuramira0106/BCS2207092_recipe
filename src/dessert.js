// Function to fetch and display dessert dishes
function fetchAndDisplayDessertDishes() {
    fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert')
        .then(response => {
            console.log('API Response:', response); // Debugging: Log the raw API response
            return response.json(); // Parse the JSON from the response
        })
        .then(data => {
            console.log('API Data:', data); // Debugging: Log the parsed data
            const mealContainer = document.getElementById('meal-container');
            mealContainer.innerHTML = ''; // Clear the container before adding new meals

            // Retrieve favorite meals from local storage
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

            // Loop through each meal in the data
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

                // Add click event to toggle favorite status
                favoriteIcon.addEventListener('click', function(event) {
                    event.stopPropagation(); // Prevent the meal card click event
                    toggleFavorite(favoriteIcon, meal); // Toggle the favorite status
                });

                // Add click event to show meal details
                mealCard.addEventListener('click', function() {
                    console.log('Fetching details for meal ID:', meal.idMeal); // Debugging: Log the meal ID
                    fetchAndShowMealDetails(meal.idMeal); // Fetch and show meal details
                });

                mealCard.appendChild(mealImg); // Append image to the meal card
                mealCard.appendChild(mealName); // Append name to the meal card
                mealCard.appendChild(favoriteIcon); // Append favorite icon to the meal card
                mealContainer.appendChild(mealCard); // Append the meal card to the container
            });
        })
        .catch(error => {
            console.error('Error fetching dessert dishes:', error); // Log any errors
        });
}

// Function to fetch and display meal details by ID
function fetchAndShowMealDetails(mealId) {
    fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + mealId)
        .then(response => {
            console.log('Meal Detail API Response:', response); // Debugging: Log the raw API response
            return response.json(); // Parse the JSON from the response
        })
        .then(data => {
            console.log('Meal Detail API Data:', data); // Debugging: Log the parsed data
            const meal = data.meals[0];

            if (!meal) {
                console.error('No meal data found'); // Log an error if no meal data is found
                return;
            }

            // Update the meal details modal with the fetched data
            const mealNameElem = document.getElementById('meal-name');
            const mealOriginElem = document.getElementById('meal-origin');
            const mealImgElem = document.getElementById('meal-img');
            const mealIngredientsElem = document.getElementById('meal-ingredients');
            const mealInstructionsElem = document.getElementById('meal-instructions');
            const mealUrlElem = document.getElementById('meal-url');

            mealNameElem.textContent = meal.strMeal; // Set meal name
            mealOriginElem.textContent = meal.strArea || 'Unknown'; // Set meal origin
            mealImgElem.src = meal.strMealThumb; // Set meal image

            // Clear previous ingredients and add new ones
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

            // Clear previous instructions and add new ones
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

            mealUrlElem.href = meal.strYoutube || '#'; // Set meal URL or use # if no YouTube link available

            // Show modal with meal details
            openModal();
        })
        .catch(error => {
            console.error('Error fetching meal details:', error); // Log any errors
        });
}

// Function to open the modal
function openModal() {
    var modal = document.getElementById('myModal');
    modal.style.display = 'block'; // Display the modal
}

// Function to close the modal
function closeModal() {
    var modal = document.getElementById('myModal');
    modal.style.display = 'none'; // Hide the modal
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
        removeFavorite(meal.idMeal); // Remove from local storage or a favorites list
    } else {
        // Add to favorites
        icon.classList.add('favorited');
        addFavorite(meal); // Add to local storage or a favorites list
    }
}

// Function to add a meal to favorites (e.g., local storage)
function addFavorite(meal) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.some(fav => fav.idMeal === meal.idMeal)) {
        favorites.push(meal); // Add the meal to the favorites list
        localStorage.setItem('favorites', JSON.stringify(favorites)); // Save the updated favorites list to local storage
    }
}

// Function to remove a meal from favorites (e.g., local storage)
function removeFavorite(mealId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.idMeal !== mealId); // Remove the meal from the favorites list
    localStorage.setItem('favorites', JSON.stringify(favorites)); // Save the updated favorites list to local storage
}

// Call the function to fetch and display dessert dishes when the page loads
fetchAndDisplayDessertDishes();
