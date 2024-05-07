const addToWatchlist = document.querySelectorAll(".add-to-watchlist")
const mainContent = document.getElementById("main-content")
const searchBtn = document.getElementById("search-btn")
const displayMode = document.getElementById("display-mode")
let moviesArray = []
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || []


/* --- event listener --- */
document.addEventListener("click", (e) => {
    if (e.target.dataset.id) {
        const targettedMovie = e.target.dataset.id
        
        if (!watchlist.includes(targettedMovie)) {
            watchlist.push(targettedMovie)
            localStorage.setItem("watchlist", JSON.stringify(watchlist))
            renderAddedToWatchlist(targettedMovie)
        }
    }
})

searchBtn.addEventListener("click", getMoviesData)


/* --- function --- */
async function getMoviesData() {
    const userSearchInput = document.getElementById(("user-search-input")).value
    moviesArray = []

    if (userSearchInput !== '') {
        console.log('movie query:', userSearchInput)

        try {
            const res = await fetch(`https://www.omdbapi.com/?apikey=98bd65f&s=${userSearchInput}`)
            const data = await res.json()
            data.Search.forEach(movie => moviesArray.push(movie.imdbID))
            console.log(moviesArray)

            if (data.Response === "True") {
                const promises = moviesArray.map(async id => {
                    const res = await fetch(`https://www.omdbapi.com/?apikey=98bd65f&i=${id}`)
                    const data = await res.json()
                    return data
                })
                const movies = await Promise.all(promises)
                console.log(movies)
                renderMovies(movies)
            }
        } 
        catch (error) {
            console.error('error: movies not found')
            renderMoviesNotFoundState()
        }
    }
}

// searchBtn.addEventListener("click", () => {
//     const userInput = userSearchInput.value
//     moviesArray = []

//     if (userInput !== '') {
//         console.log('input:', userInput)

//     fetch(`http://www.omdbapi.com/?apikey=98bd65f&s=${userInput}`)
//         .then(res => res.json())
//         .then(data => {
//             data.Search.forEach(movie => moviesArray.push(movie.imdbID))
//             console.log(moviesArray)
            
//             if (data.Response === "True") {
//                 const promises = moviesArray.map(id => {
//                     return fetch(`http://www.omdbapi.com/?apikey=98bd65f&i=${id}`)
//                         .then(res => res.json())
//                 })

//                 Promise.all(promises)
//                     .then(movies => {
//                         console.log(movies)
//                         renderMovies(movies)
//                     })
//                     .catch(error => {
//                         console.error('Error fetching movie data')
//                     })
//             }
//         })
//         .catch(error => {
//             console.error('error: movies not found')
//             setTimeout(renderMoviesNotFoundState, 3000)
//         })
//     }
// })

function renderMovies(movies) {
    const moviesList = movies.map(movie => {
        return `
            <div class="movie flex">
                <img src="${movie.Poster}" alt="poster of the movie" class="movie-img"/>
                <div class="movie-desc flex">
                    <div class="desc-top flex">
                        <h2>${movie.Title}</h2>
                        <p class="rating">⭐ ${movie.imdbRating}</p>
                    </div>
                    <div class="desc-mid flex">
                        <p>${movie.Runtime}</p>
                        <p>${movie.Genre}</p>
                        <div id="add-to-watchlist" class="add-to-watchlist" data-id="${movie.imdbID}">
                            <p id="watchlist-text" data-id="${movie.imdbID}"><i id="add-icon" class="fa-solid fa-circle-plus"></i>Watchlist</p>
                        </div>
                    </div>
                    <div class="desc-bottom flex">
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

function renderAddedToWatchlist(targettedMovie) {
    const movieAddedToWatchlist = document.querySelector(`#add-to-watchlist[data-id="${targettedMovie}"]`)

    if (movieAddedToWatchlist) {
        movieAddedToWatchlist.innerHTML = `
            <p id="watchlist-text" class"teal-color"><i id="add-icon" class="fa-solid fa-circle-check teal-color"></i>Added to watchlist</p>
        `
    }
}

// displayMode.addEventListener("click", toggleDisplayMode)

// function toggleDisplayMode() {
//     document.body.classList.toggle('dark-mode')
//     document.getElementById("container").classList.toggle('dark-mode')

//     if (document.body.classList.contains('dark-mode')) {
//         displayMode.textContent = " Dark Mode"

//     } else {
//         displayMode.textContent = " Light Mode"
//     }
// }