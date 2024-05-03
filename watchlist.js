const mainContent = document.getElementById("main-content")
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || []
let myMovieWatchlistArray = []


const promises = watchlist.map(id => {
    return fetch(`http://www.omdbapi.com/?apikey=98bd65f&i=${id}`)
        .then(res => res.json())
        .then(data => {
            myMovieWatchlistArray.push(data)
        })
        .catch(error => console.error('Error fetching movie data:', error))
})

Promise.all(promises)
    .then(() => {
        console.log(myMovieWatchlistArray)
        renderMovies(myMovieWatchlistArray)

        if (watchlist.length === 0) {
            renderEmptyWatchlistState()
        }
    })
    .catch(error => console.error('Error rendering movies:', error));


function renderMovies(myMovies) {
    const myMoviesList = myMovies.map(movie => {
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
                            <i id="icon" class="fa-solid fa-circle-minus" data-id="${movie.imdbID}"></i>
                            <p id="watchlist-text" data-id="${movie.imdbID}">Remove</p>
                        </a>
                    </div>
                    <div class="desc-bottom">
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
        <div class="initial-state">
            <p class="default-text">Your watchlist is looking a little empty...</p>
            <a href="index.html" class="add-some-movies">
                <i class="fa-solid fa-circle-plus"></i>
                <span class="recommendation">Let's add some movies!</span>
            </a>
        </div>
    `
}

document.addEventListener("click", (e) => {
    if (e.target.dataset.id) {
        console.log(e.target.dataset.id)
        const specificID = e.target.dataset.id
        
        if (watchlist.includes(specificID)) {
            watchlist = watchlist.filter(id => id !== specificID) // remove that specificID from watchlist
            localStorage.setItem("watchlist", JSON.stringify(watchlist))
                .then(() => {
                    renderMovies()
                })
        }
    }
})