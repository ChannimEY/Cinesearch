const api_key = "bca9ef1e1dad6a042f3fb2ddd3d107ab";
const img_container = document.getElementById("movieDisplay");
let movie_image = [];

const pagination_element = document.getElementById("pagination");
const rows = 3;
const previous_btn = document.getElementById("prevoius");
const next_btn = document.getElementById("next");
const search_btn = document.getElementById("searchBtn");
let current_page = 1;
const filter = document.getElementById("filter");
const movie_filter = document.getElementById("movieFilter");
const series_filter = document.getElementById("seriesFilter");
let info = document.getElementById("info");
let filter_value;

fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${api_key}`)
  .then((response) =>
    response.ok ? response.json() : console.error("Fetching Error!")
  )
  .then((data) => {
    filter_value = "Trending";
    movie_image = data.results;
    displayMovies();
    setupPagination();
  })
  .catch((error) => console.log(error));

// Hide movie details initially
info.style.display = "none";

function displayMovies() {
  const start = (current_page - 1) * rows;
  const end = start + rows;
  const paginated_movies = movie_image.slice(start, end);

  img_container.innerHTML = paginated_movies
    .map((movie) => {
      return `
        <div id="movie">
          <img class="movie-img"
               data-src="${
                 movie.poster_path
                   ? "https://image.tmdb.org/t/p/w500/" + movie.poster_path
                   : "fallback"
               }"
               alt="${filter_value == "Series" ? movie.name : movie.title}"/>
          <div class="details">
              <span>${filter_value == "Series" ? "Series" : "Movie"}</span>
              <h2>${filter_value == "Series" ? movie.name : movie.title}</h2>
              <div>
                <p>${
                  filter_value == "Series"
                    ? movie.first_air_date?.substring(0, 4) || "N/A"
                    : movie.release_date?.substring(0, 4) || "N/A"
                }</p>
              </div>
              <button class="detail-btn" data-id=${movie.id}>Details</button>
          </div>
        </div>
        `;
    })
    .join("");

  document.querySelectorAll(".movie-img").forEach((img) => {
    img.src =
      img.dataset.src !== "fallback"
        ? img.dataset.src
        : "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";

    img.onerror = function () {
      this.src =
        "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";
    };
  });

  document.querySelectorAll(".detail-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const movie_id = event.target.dataset.id;
      fetchMovieDetail(movie_id);
    });
  });
}

movie_filter.addEventListener("click", () => {
  filter.innerHTML = movie_filter.textContent;
});
series_filter.addEventListener("click", () => {
  filter.innerHTML = series_filter.textContent;
});

search_btn.addEventListener("click", () => {
  const movie_name = document.getElementById("searchBox").value;
  if (filter.innerHTML == "type") {
    alert("Please select type");
    return;
  }
  if (movie_name === "") return;
  current_page = 1;

  if (filter.innerHTML == "Movie") {
    filter_value = "Movie";
    fetch(
      `https://api.themoviedb.org/3/search/movie?query=${movie_name}&api_key=${api_key}`
    )
      .then((response) =>
        response.ok ? response.json() : console.error("Fetching Error!")
      )
      .then((data) => {
        movie_image = data.results;
        displayMovies();
        setupPagination();
      })
      .catch((error) => console.log(error));
  } else if (filter.innerHTML == "Series") {
    filter_value = "Series";
    fetch(
      `https://api.themoviedb.org/3/search/tv?query=${movie_name}&api_key=${api_key}`
    )
      .then((response) =>
        response.ok ? response.json() : console.error("Fetching Error!")
      )
      .then((data) => {
        movie_image = data.results;
        displayMovies();
        setupPagination();
      })
      .catch((error) => console.log(error));
  }
});

function fetchMovieDetail(id) {
  const is_movie = filter_value === "Movie" || filter_value === "Trending";
  const url = is_movie
    ? `https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}`
    : `https://api.themoviedb.org/3/tv/${id}?api_key=${api_key}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("Fetching Error!");
      return response.json();
    })
    .then((data) => {
      const credits_url = is_movie
        ? `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${api_key}`
        : `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${api_key}`;

      fetch(credits_url)
        .then((credits_response) => {
          if (!credits_response.ok) throw new Error("Fetching Credits Error!");
          return credits_response.json();
        })
        .then((credits_data) => {
          const genres = data.genres.map((genre) => genre.name).join(", ");
          const directors = credits_data.crew.filter(
            (person) => person.job === "Director"
          );
          const director_name = directors.length
            ? directors.map((director) => director.name).join(", ")
            : "Director not found in this API!";
          const top_ten_actors = credits_data.cast
            .slice(0, 10)
            .map((actor) => `${actor.name} (${actor.character})`)
            .join(", ");
          const writers = credits_data.crew.filter(
            (person) => person.job === "Writer"
          );
          const writers_name = writers.length
            ? writers.map((writer) => writer.name).join(", ")
            : "Writer not found in this API!";
          info.style.display = "flex";
          info.innerHTML = `
<img src="https://image.tmdb.org/t/p/w500/${data.poster_path}"
     alt="${is_movie ? data.title : "No Image Available"}"
     onerror="this.onerror=null; this.src='https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=';" />

            <div class="movie-details">
              <b><span>Title:</span></b>
              <p>${is_movie ? data.title : data.name}</p>
              <b><span>Released:</span></b>
              <p>${is_movie ? data.release_date : data.first_air_date}</p>
              <b><span>Genre:</span></b>
              <p>${genres}</p>
              <b><span>Country:</span></b>
              <p>${data.origin_country}</p>
              <b><span>Director:</span></b>
              <p>${director_name}</p>
              <b><span>Writer:</span></b>
              <p>${writers_name}</p>
              <b><span>Actors:</span></b>
              <p>${top_ten_actors}</p>
              <b><span>Awards:</span></b>
              <p>4 wins & 7 nominations</p>
            </div>
          `;
        })
        .catch((error) => console.error("Error fetching credits:", error));
    })
    .catch((error) => console.error("Error fetching movie details:", error));
}

let page_count_temp;
function setupPagination() {
  const page_count = Math.ceil(movie_image.length / rows);
  page_count_temp = page_count;
  pagination_element.innerHTML = "";

  let start_page = Math.max(current_page - 2, 1);
  let end_page = Math.min(start_page + 3, page_count);

  for (let i = start_page; i <= end_page; i++) {
    const button = document.createElement("button");
    button.innerText = i;

    if (current_page == i) button.classList.add("active");
    button.addEventListener("click", () => {
      current_page = i;
      displayMovies();
      setupPagination();
    });

    pagination_element.appendChild(button);
  }
}

previous_btn.addEventListener("click", () => {
  if (current_page == 1) {
    return;
  }
  current_page--;
  displayMovies();
  setupPagination();
});
next_btn.addEventListener("click", () => {
  if (current_page >= page_count_temp) {
    return;
  }
  current_page++;
  displayMovies();
  setupPagination();
});
