const addToWatchlist = document.getElementById("add-to-watchlist")
const mainContent = document.getElementById("main-content")
const userSearchInput = document.getElementById(("user-search-input"))
const searchBtn = document.getElementById("search-btn")
let moviesArray = []


// let isClicked = false

// addToWatchlist.addEventListener("click", () => {
//     if (isClicked) {
//         addToWatchlist.innerHTML = `
//             <i id="icon" class="fa-solid fa-circle-plus"></i>
//             <p id="watchlist-text">Watchlist</p>
//         `
//     } else {
//         addToWatchlist.innerHTML = `
//             <i id="icon" class="fa-solid fa-circle-minus"></i>
//             <p id="watchlist-text">Remove</p>
//         `
//     }
//     isClicked = !isClicked
// })

searchBtn.addEventListener("click", () => {
    const userInput = userSearchInput.value

    moviesArray = []

    if (userInput !== '') {
        console.log('input:', userInput)

    fetch(`http://www.omdbapi.com/?apikey=98bd65f&s=${userInput}`)
        .then(res => res.json())
        .then(data => {

            data.Search.forEach(movie => {
                moviesArray.push(movie.imdbID)
            })
            console.log(moviesArray)
            
            if (data.Response === "True") {
                const promises = moviesArray.map(id => {
                    return fetch(`http://www.omdbapi.com/?apikey=98bd65f&i=${id}`)
                        .then(res => res.json())
                });

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
                    <div class="movie-rating">
                        <i id="icon" class="fa-solid fa-star"></i>
                        <p class="rating">${movie.imdbRating}</p>
                    </div>
                </div>
                <div class="desc-mid">
                    <p>${movie.Runtime}</p>
                    <p>${movie.Genre}</p>
                    <a id="add-to-watchlist" class="add-to-watchlist">
                        <i id="icon" class="fa-solid fa-circle-plus"></i>
                        <p id="watchlist-text">Watchlist</p>
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
}

function renderMoviesNotFoundState () {
    mainContent.innerHTML = `
        <div class="initial-state">
            <p class="default-text">Unable to find what you’re looking for. Please try another search.</p>
        </div>
    `
}
