// MOVIE GENERATOR APP
// 1.	A landing page with the app HEADING and form containing list of GENRE radio buttons, RELEASE DATE ranges and minimum POPULARITY score in dropdown menu format with SUBMIT button.
// 2.	Listen to release date dropdown change events, if both dropdowns contain a value, validate to ensure they are within a valid range.Display error if selection is incorrect.
// 3.	Listen to submit button click event and validate that all form inputs have been completed.Display error if incomplete.
// 4.	Following successful form validation, execute API call, passing the input data as paramaters to return filtered list of movies.
// 5.	Select a random movie from returned movie list.
// 6.	Clear any previously displayed movies and display the following properties from the randomly selected movie: title, poster, overview, average vote count, release date.

const movieApp = {};

movieApp.getData = (genre) => {
    const url = new URL('https://api.themoviedb.org/3/discover/movie')
    url.search = new URLSearchParams({
        api_key: 'be004bf3fc203fe839ccb38c47ddc0ee',
        with_original_language: 'en',
        sort_by: 'popularity.desc',
        with_genres: genre
        // 'primary_release_date.gte': '2021-01-01',
        // 'primary_release_date.lte': movieApp.getTodaysDate()
    })

    fetch(url)
        .then(function (response) {
            //parse the response into JSON
            return response.json()
        }).then(function (jsonResponse) {
            // work with the data from the API

            //check if results have poster path, re-assign if not
            let movie = movieApp.randomItem(jsonResponse.results);
            while (!movie.poster_path) {
                movie = movieApp.randomItem(jsonResponse.results);
            }

            movieApp.displayMovie(movie);
            
        })
    }

// movieApp.getTodaysDate = () => {
//     let today = new Date();
//     const dd = String(today.getDate()).padStart(2, '0');
//     const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
//     const yyyy = today.getFullYear();

//     today = mm + '-' + dd + '-' + yyyy;
//     return(today);
// }
    
movieApp.displayMovie = (movie) => {
    console.log(movie);

    const movieTitle = document.querySelector('.movie-results h2');
    const movieImg = document.querySelector('.movie-results img');
    const movieOverview = document.querySelector('.movie-results .overview');
    const movieVoteAvg = document.querySelector('.movie-results .vote-avg');
    const movieReleaseDt = document.querySelector('.movie-results .release-dt');

    movieTitle.textContent = movie.title;
    movieOverview.textContent = movie.overview;
    movieImg.src = "https://image.tmdb.org/t/p/w500/" + movie.poster_path;
    movieImg.alt = movie.title + " movie poster"
    // movieVoteAvg.textContent = "Vote Average: " + movie.vote_average;
    movieReleaseDt.textContent = "Release Date: " + movie.release_date;

    //** stars!!! would need to remove p in html...might be easier to set all up in JS? **
    console.log(movie.vote_average)
    movieVoteAvg.innerHTML = `
        <div class="vote-average">
            <p class="sr-only">Vote Average: ${movie.vote_average}</p>
            <div class="star-ratings">
                <div class="empty-ratings">
                    <i class="far fa-star"></i>
                    <i class="far fa-star"></i>
                    <i class="far fa-star"></i>
                    <i class="far fa-star"></i>
                    <i class="far fa-star"></i>
                    <i class="far fa-star"></i>
                    <i class="far fa-star"></i>
                    <i class="far fa-star"></i>
                    <i class="far fa-star"></i>
                    <i class="far fa-star"></i>
                </div> 
                <div class="fill-ratings" style="width: ${movie.vote_average * 10}%;">
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                </div>
            </div>
            <p>(${movie.vote_count} votes)</p>
        </div>`
}

movieApp.randomItem = (arr) => {
    const randomEl = Math.floor(Math.random() * arr.length);
    return arr[randomEl];
}

movieApp.init = () => {

    const formEl = document.querySelector('form');
    
    //add submit event listener
    formEl.addEventListener('submit', (event) => {
        event.preventDefault();
        const genre = document.querySelector('input[name="genre"]:checked');

        //call getData function
        movieApp.getData(genre.value)
    });
    
};

movieApp.init();


