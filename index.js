const API_KEY = "3e22ff3c3d485684d4ef358a6fe96f04";
const IMG_CONTAINER = document.getElementById("movieDisplay");
const SEARCH_BTN = document.getElementById("searchBtn");
const FILTER = document.getElementById("type");
const SEARCH_BOX = document.getElementById("searchBox");
const PREVIOUS_BTN = document.getElementById("previousBtn");
const NEXT_BTN = document.getElementById("nextBtn");
const PAGINATION = document.getElementById("pagination");

let movieImage = [];
let currentPage = 1;
const ROWS = 3;
let totalPages = 1; // Total number of pages

// Event listener for the search button
SEARCH_BTN.addEventListener("click", () => {
    const movieName = SEARCH_BOX.value.trim();
    const filterValue = FILTER.value;

    if (movieName === "") {
        alert("Please enter a movie name");
        return;
    }

    if (filterValue === "series" || filterValue === "movie") {
        currentPage = 1;
        fetchMovies(movieName, filterValue);
    } else {
        alert("Please select a type");
    }
});

// Fetch movies based on search query and type
function fetchMovies(query, type) {
    const url = `https://api.themoviedb.org/3/search/${type}?query=${query}&api_key=${API_KEY}&page=${currentPage}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            movieImage = data.results;
            totalPages = data.total_pages; // Set the total pages based on the API response
            displayMovies();
            updatePaginationButtons();
        })
        .catch(error => console.log(error));
}

// Display the fetched movies
function displayMovies() {
    IMG_CONTAINER.innerHTML = movieImage
        .map(movie => {
            return `
                <div class="movie-card">
                    <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path || 'https://cdn-icons-png.flaticon.com/512/2748/2748558.png'}" alt="${movie.title || movie.name}" />
                    <div class="movie-details">
                        <h2>${movie.title || movie.name}</h2>
                        <p>Rating: ${movie.vote_average}</p>
                        <p>Release Date: ${movie.release_date || movie.first_air_date}</p>
                        <button class="detail-btn" data-id="${movie.id}">Details</button>
                    </div>
                </div>
            `;
        })
        .join("");
}

// Event listener for pagination
PREVIOUS_BTN.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        const movieName = SEARCH_BOX.value.trim();
        const filterValue = FILTER.value;
        fetchMovies(movieName, filterValue);
    }
});

NEXT_BTN.addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
        const movieName = SEARCH_BOX.value.trim();
        const filterValue = FILTER.value;
        fetchMovies(movieName, filterValue);
    }
});

// Update pagination buttons state (previous/next)
function updatePaginationButtons() {
    PREVIOUS_BTN.disabled = currentPage === 1;
    NEXT_BTN.disabled = currentPage === totalPages;

    // Optionally, you can highlight the current page, but for now, we disable buttons.
}

// Event listener for movie details button
IMG_CONTAINER.addEventListener("click", (event) => {
    if (event.target.classList.contains("detail-btn")) {
        const movieId = event.target.dataset.id;
        fetchMovieDetail(movieId);
    }
});

// Fetch detailed movie info
function fetchMovieDetail(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            alert(`Title: ${data.title}\nOverview: ${data.overview}`);
        })
        .catch(error => console.log(error));
}
