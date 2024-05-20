const mainContent = document.getElementById("main-content")
const displayModeBtn = document.getElementById("display-mode")
const currentDisplayMode = localStorage.getItem("displayMode") || "light"
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || []
let myMovieWatchlistArray = []

/* --- event listener --- */
document.addEventListener("DOMContentLoaded", () => {
    setDisplayMode(currentDisplayMode)
})

document.addEventListener("click", (e) => {
    if (e.target.dataset.id) {
        console.log(e.target.dataset.id)
        const specificID = e.target.dataset.id
        
        if (watchlist.includes(specificID)) {
            watchlist = watchlist.filter(id => id !== specificID) // remove that specificID from watchlist
            localStorage.setItem("watchlist", JSON.stringify(watchlist))
            myMovieWatchlistArray = myMovieWatchlistArray.filter(movie => movie.imdbID !== specificID) // Update myMovieWatchlistArray to reflect the changes
            renderMovies(myMovieWatchlistArray)
        }

        if (watchlist.length === 0) {
            renderEmptyWatchlistState()
        }
    }
})

displayModeBtn.addEventListener("click", () => {
    const newMode = document.body.classList.contains("dark-mode") ? "light" : "dark"
    setDisplayMode(newMode)
})

renderWatchlist()


/* --- function --- */
async function renderWatchlist() {
    try {
        const promises = watchlist.map(async id => {
            try {
                const res = await fetch(`https://www.omdbapi.com/?apikey=98bd65f&i=${id}`)
                const data = await res.json()
                myMovieWatchlistArray.push(data)
            }
            catch {
                console.error('Error fetching movie data:', error)
            }
        })
        await Promise.all(promises)

        console.log(myMovieWatchlistArray)
        if (watchlist.length === 0) {
            renderEmptyWatchlistState()
        } else {
            renderMovies(myMovieWatchlistArray)
        }
    } 
    catch (error) {
        console.error('Error rendering movies:', error)
    }
}

function renderMovies(myMovies) {
    const myMoviesList = myMovies.map(movie => {
        return `
            <div class="movie flex">
                <img src="${movie.Poster}" alt="poster of the movie" class="movie-img"/>
                <div class="movie-desc">
                    <div class="desc-top flex">
                        <h2>${movie.Title}</h2>
                        <p class="rating">⭐ ${movie.imdbRating}</p>
                    </div>
                    <div class="desc-mid flex">
                        <p>${movie.Runtime}</p>
                        <p>${movie.Genre}</p>
                        <div id="add-to-watchlist" class="remove-from-watchlist">
                            <p id="watchlist-text" data-id="${movie.imdbID}"><i id="icon" class="fa-solid fa-circle-minus"></i>Remove</p>
                        </div>
                    </div>
                    <div class="desc-bottom flex">
                        <p class="movie-plot">${movie.Plot}</p>
                    </div>
                </div>
            </div>
        `
    }).join('')

    mainContent.innerHTML = myMoviesList
}

function renderEmptyWatchlistState() {
    mainContent.innerHTML = `
        <div class="initial-state flex">
            <p class="default-text">Your watchlist is looking a little empty...</p>
            <a href="index.html" class="add-some-movies flex">
                <span class="recommendation"><i class="fa-solid fa-circle-plus"></i>Let's add some movies!</span>
            </a>
        </div>
    `
}

function setDisplayMode(mode) {
    const isDarkMode = mode === "dark"

    document.body.classList.toggle("dark-mode", isDarkMode)
    document.getElementById("container").classList.toggle("dark-mode-bg", isDarkMode)
    document.querySelectorAll(".movie").forEach(movieContainer => movieContainer.classList.toggle("dark-mode-border", isDarkMode))
    document.querySelectorAll(".movie-plot").forEach(plot => plot.classList.toggle("dark-mode-p", isDarkMode))
    
    displayModeBtn.textContent = isDarkMode ? " Dark Mode" : " Light Mode"
    localStorage.setItem("displayMode", mode)
}

