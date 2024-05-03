const addToWatchlistBtn = document.querySelectorAll(".add-to-watchlist")
const mainContent = document.getElementById("main-content")
const userSearchInput = document.getElementById(("user-search-input"))
const searchBtn = document.getElementById("search-btn")
let moviesArray = []
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || []


document.addEventListener("click", (e) => {
    if (e.target.dataset.id) {
        const targettedMovie = e.target.dataset.id
        
        if (!watchlist.includes(targettedMovie)) {
            watchlist.push(targettedMovie)
            localStorage.setItem("watchlist", JSON.stringify(watchlist))
        }
    }
})


searchBtn.addEventListener("click", () => {
    const userInput = userSearchInput.value

    moviesArray = []

    if (userInput !== '') {
        console.log('input:', userInput)

    fetch(`https://www.omdbapi.com/?apikey=98bd65f&s=${userInput}`)
        .then(res => res.json())
        .then(data => {

            data.Search.forEach(movie => {
                moviesArray.push(movie.imdbID)
            })
            console.log(moviesArray)
            
            if (data.Response === "True") {
                const promises = moviesArray.map(id => {
                    return fetch(`https://www.omdbapi.com/?apikey=98bd65f&i=${id}`)
                        .then(res => res.json())
                })

                Promise.all(promises)
                    .then(movies => {
                        console.log(movies)
                        renderMovies(movies)
                    })
                    .catch(error => {
                        console.error('Error fetching movie data')
                    })
            }
        })
        .catch(error => {
            console.error('error: movies not found')
            setTimeout(renderMoviesNotFoundState, 3000)
        })
    }
})


function renderMovies(movies) {
    const moviesList = movies.map(movie => {
        return `
            <div class="movie">
                <img src="${movie.Poster}" alt="poster of the movie" class="movie-img"/>
                <div class="movie-desc">
                    <div class="desc-top">
                        <h2>${movie.Title}</h2>
                        <p class="rating">⭐ ${movie.imdbRating}</p>
                    </div>
                    <div class="desc-mid">
                        <p>${movie.Runtime}</p>
                        <p>${movie.Genre}</p>
                        <a id="add-to-watchlist" class="add-to-watchlist">
                            <i id="icon" class="fa-solid fa-circle-plus" data-id="${movie.imdbID}"></i>
                            <p id="watchlist-text" data-id="${movie.imdbID}">Watchlist</p>
                        </a>
                    </div>
                    <div class="desc-bottom">
                        <p class="movie-plot">${movie.Plot}</p>
                    </div>
                </div>
            </div>
        `
    }).join('')

    mainContent.innerHTML = moviesList

    addToWatchlistBtn.forEach(btn => {
        btn.addEventListener("click", (event) => {
          const clickedMovieId = event.target.dataset.add
          console.log(`Movie with ID ${clickedMovieId} was added to watchlist`)
        })
    })
}

function renderMoviesNotFoundState () {
    mainContent.innerHTML = `
        <div class="initial-state">
            <p class="default-text">Unable to find what you’re looking for. Please try another search.</p>
        </div>
    `
}
