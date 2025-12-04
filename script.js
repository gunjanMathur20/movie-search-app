// ====== DOM Element Selection ======= //
const searchForm = document.querySelector("form");
const movieContainer = document.querySelector(".movie-container");
const inputBox = document.querySelector(".inputBox");
const randomMovie = document.querySelector(".random-movies");
const similarSection = document.querySelector(".similar-movies-section");
const similarContainer = document.querySelector(".similar-movies");

// ======= Function to fetch and show full movie details by title ======= //
const fetchMovieDetails = async (title) => {
  try {
    const url = `https://www.omdbapi.com/?apikey=652a18b2&t=${encodeURIComponent(
      title
    )}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.Response === "True") {
      showMovieData(data);
    } else {
      showErrorMessage(" Could not load full movie details.");
    }
  } catch (error) {
    showErrorMessage("Something went wrong while loading details.");
  }
};

// ======= Function to fetch movie search results (similar titles) ======= //
const getMovieInfo = async (movie) => {
  try {
    const myAPIKey = "652a18b2";
    const url = `https://www.omdbapi.com/?apikey=${myAPIKey}&s=${encodeURIComponent(
      movie
    )}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "False") {
      showErrorMessage("Movie not found! Please try again 🎥");
      similarSection.style.display = "none";
    } else {
      const results = data.Search;
      const firstMovie = results[0];

      fetchMovieDetails(firstMovie.Title); // Show first movie details
      showSimilarMovies(results); // Show other similar movies
    }
  } catch (error) {
    showErrorMessage("Something went wrong. Try again.");
  }
};

// =========  Function to display movie details after search ======== //
const showMovieData = (data) => {
  movieContainer.innerHTML = ""; // Clear previous content
  movieContainer.classList.remove("noBackground", "poster-grid");

  const {
    Title,
    imdbRating,
    Genre,
    Released,
    Runtime,
    Actors,
    Plot,
    Poster,
    Country,
    Language,
    Type,
  } = data;

  const movieElement = document.createElement("div");
  movieElement.classList.add("movie-info");

  movieElement.innerHTML = `
    <h2>${Title}</h2>
    <p><strong>Rating: &#11088;</strong> ${imdbRating}</p>`;

  const movieGenreElement = document.createElement("div");
  movieGenreElement.classList.add("movie-genre");

  Genre.split(", ").forEach((element) => {
    const p = document.createElement("p");
    p.innerText = element;
    movieGenreElement.appendChild(p);
  });

  movieElement.appendChild(movieGenreElement);

  movieElement.innerHTML += `
    <p><strong>Released Date: </strong>${Released}</p>
    <p><strong>Duration: </strong>${Runtime}</p>
    <p><strong>Type: </strong>${Type}</p>
    <p><strong>Cast: </strong>${Actors}</p>
    <p><strong>Language: </strong>${Language}</p>
    <p><strong>Country: </strong>${Country}</p>
    <p><strong>Description: </strong>${Plot}</p>`;

  const moviePoster = document.createElement("div");
  moviePoster.classList.add("movie-poster");
  moviePoster.innerHTML = `<img src="${Poster}" alt="${Title}" />`;

  movieContainer.appendChild(moviePoster);
  movieContainer.appendChild(movieElement);
  movieContainer.style.display = "flex";
};

// ===== Function to show similar movies (posters only) ===== //
const showSimilarMovies = (movies) => {
  similarContainer.innerHTML = "";

  movies.forEach((movie) => {
    const poster =
      movie.Poster !== "N/A"
        ? movie.Poster
        : "https://via.placeholder.com/150x220?text=No+Image";

    const movieDiv = document.createElement("div");
    movieDiv.classList.add("random-movie-item");

    movieDiv.innerHTML = `
      <img src="${poster}" alt="${movie.Title}" title="${movie.Title}" />
      <p style="font-weight: bold;">${movie.Title}</p>`;

    // On clicking similar movie
    movieDiv.addEventListener("click", () => {
      fetchMovieDetails(movie.Title);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    similarContainer.appendChild(movieDiv);
  });

  similarSection.style.display = "block";
};

// ====== Function to show error or info message ======= //
const showErrorMessage = (message) => {
  movieContainer.innerHTML = `<h2>${message}</h2>`;
  movieContainer.classList.add("noBackground");
  similarSection.style.display = "none";
};

// ====== Function to show random movie posters on page load ======= //
const showRandomPosters = async () => {
  const randomMovies = [
    "Elemental",
    "Evil Dead",
    "The Conjuring",
    "Luca",
    "Avatar",
    "Spirited Away",
    "Avengers",
    "The Ring",
    "Coco",
    "Wish Dragon",
    "Mummy",
    "Suzume",
    "Rio",
    "Fidaa",
  ];

  randomMovie.innerHTML = "";
  randomMovie.classList.add("poster-grid");

  for (const title of randomMovies) {
    const url = `https://www.omdbapi.com/?apikey=652a18b2&t=${encodeURIComponent(
      title
    )}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === "True") {
        const poster =
          data.Poster !== "N/A"
            ? data.Poster
            : "https://via.placeholder.com/200x300?text=No+Image";

        const posterDiv = document.createElement("div");
        posterDiv.classList.add("random-movie-item");

        posterDiv.innerHTML = `
          <img src="${poster}" alt="${data.Title}" title="${data.Title}" />
          <p style="font-weight: bold; margin-top: 5px;">${data.Title}</p>
        `;

        randomMovie.appendChild(posterDiv);
      }
    } catch (err) {
      console.error(`Error fetching ${title}:`, err);
    }
  }
};

// ===== Handle form submission ===== //
const handleFormSubmission = (e) => {
  e.preventDefault();

  const movieName = inputBox.value.trim();
  similarSection.style.display = "none";

  if (movieName !== "") {
    randomMovie.style.display = "none";
    movieContainer.style.display = "flex";
    showErrorMessage("⏳ Fetching movie... Please wait 🍿");
    getMovieInfo(movieName);
  } else {
    randomMovie.style.display = "flex";
    movieContainer.style.display = "none";
    similarSection.style.display = "none";
    showErrorMessage("🎬 Enter movie name...");
  }
};

// ====== Event Listeners ====== //
searchForm.addEventListener("submit", handleFormSubmission);

document.addEventListener("DOMContentLoaded", () => {
  showRandomPosters();
  randomMovie.style.display = "flex";
  movieContainer.style.display = "none";
  similarSection.style.display = "none";
});
