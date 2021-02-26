
const movieApp = {};

movieApp.resultsContainer = '';
movieApp.movie = '';
movieApp.movieID = '';
movieApp.similarMoviesArr = [];
movieApp.baseURL = 'https://api.themoviedb.org/3/';
movieApp.apiKey = 'be004bf3fc203fe839ccb38c47ddc0ee';

//get movie options from TMDB API
movieApp.getData = (genre) => {

    //construct discover endpoint
    const urlDiscover = new URL(movieApp.baseURL + 'discover/movie')
    urlDiscover.search = new URLSearchParams({
        api_key: movieApp.apiKey,
        with_original_language: 'en',
        with_genres: genre,
        'primary_release_date.lte': movieApp.reformatDate(new Date(), true)
    })

    //get movie data using discover endpoint
    fetch(urlDiscover).then(function(response) {
            //parse response into JSON
            return response.json()
        }).then(function (jsonResponse) {

            //filter returned array to exclude those without a poster path
            const newArr = jsonResponse.results.filter((el) => {
                if (el.poster_path) {
                    return el;
                };
            });

            //select + store random movie
            movieApp.movie = movieApp.randomItem(newArr);
            movieApp.movieID = movieApp.movie.id;
            
        }).then(function() {
            
            //construct movie trailer endpoint
            const urlTrailer = new URL(movieApp.baseURL + 'movie/' + movieApp.movieID + '/videos')
            urlTrailer.search = new URLSearchParams({
                api_key: movieApp.apiKey
            })

            //construct similar movie endpoint
            const urlSimilarMovies = new URL(movieApp.baseURL + 'movie/' + movieApp.movieID + '/similar')
            urlSimilarMovies.search = new URLSearchParams({
                api_key: movieApp.apiKey,
                language: 'en'
            })

            const urls = [urlTrailer, urlSimilarMovies];

            //map promises to array
            const requests = urls.map(url => {
                return fetch(url)
                .then(response => {
                    return response.json();
                })
            });

            //resolve both promises
            Promise.all(requests)
                .then(data => {

                    //get trailer key
                    let trailerKey;
                    const trailerData = data[0].results;
                        //loop through returned array to find first YouTube trailer
                        for (let i = 0; i < trailerData.length; i++) {
                            const video = trailerData[i]
                            if (video.site == 'YouTube' && video.type == 'Trailer') {
                                trailerKey = video.key;
                                break;
                            }
                        }

                    //get similar movies
                    const similarMovieData = data[1].results;

                    let similarMovies = false;
                    //filter returned array to exclude those without a poster path
                    movieApp.similarMoviesArr = similarMovieData.filter((el) => {
                        if (el.poster_path) {                        
                            similarMovies = true;
                            return el;
                        };                    
                    });

                    //display movie, incl. trailer + similar movie buttons, if applicable
                    movieApp.displayMovie(genre, trailerKey, similarMovies);
                });
        });
}

//display random movie
movieApp.displayMovie = (genreID, trailerKey, similarMovies) => {

    //locate + clear results container
    movieApp.resultsContainer.innerHTML = '';
    movieApp.resultsContainer.classList.add('movie-results-container');

    //display movie, if movie set (if no error)
    if (movieApp.movie) {

        //construct elements
            //create poster img container
            const posterImgContainer = document.createElement('div');
            posterImgContainer.classList.add('movie-img');

            //append poster image to container
            const posterImg = document.createElement('img');
            posterImg.src = "https://image.tmdb.org/t/p/w500/" + movieApp.movie.poster_path;
            posterImg.alt = movieApp.movie.title + " movie poster";
            posterImgContainer.appendChild(posterImg);

            //create overview container
            const overviewContainer = document.createElement('div');
            overviewContainer.classList.add('movie-txt');

            //create overview title
            const overviewTitle = document.createElement('h3');
            overviewTitle.textContent = 'Overview:';

            //create star rating containers
            const ratingsContainer = document.createElement('div');
            ratingsContainer.classList.add('vote-average')
            const starContainer = document.createElement('div');
            starContainer.classList.add('star-ratings')
            const starFilledContainer = document.createElement('div');
            starFilledContainer.classList.add('fill-ratings')
            const starEmptyContainer = document.createElement('div');
            starEmptyContainer.classList.add('empty-ratings')

            ratingsContainer.appendChild(starContainer);
            starContainer.append(starEmptyContainer, starFilledContainer);

            //add sr-only rating text
            const srText = document.createElement('p');
            srText.classList.add('sr-only');
            srText.textContent = `Vote Average: ${movieApp.movie.vote_average} / 10`
            ratingsContainer.appendChild(srText);

            //add stars
            movieApp.addStars('fa fa-star', starFilledContainer);
            movieApp.addStars('far fa-star', starEmptyContainer);

            //update width of filled stars to rating value
            starFilledContainer.setAttribute('style', `width: ${movieApp.movie.vote_average * 10}%;`);

            //add vote count
            const voteCnt = document.createElement('p');
            voteCnt.textContent = `(${movieApp.movie.vote_count} votes)`;
            ratingsContainer.appendChild(voteCnt);

            //create genre container
            const genreContainer = document.createElement('div');
            genreContainer.classList.add('sub-heading');
            const genreHeader = document.createElement('h3');
            genreHeader.textContent = 'Genres: ';
            const genreValue = document.createElement('div');
            genreValue.classList.add('genre-thumbnails');

            //genre IDs in selected movie
            const genreArray = movieApp.movie.genre_ids;

            //genre IDs with corresponding icon and label
            const genreIcons = {
                28: { icon: 'fas fa-car-crash', label: 'Action' },
                12: { icon: 'fas fa-map-signs', label: 'Adventure' },
                35: { icon: 'fas fa-grin-squint-tears', label: 'Comedy' },
                18: { icon: 'fas fa-theater-masks', label: 'Drama' },
                14: { icon: 'fab fa-fort-awesome', label: 'Fantasy' },
                27: { icon: 'fas fa-ghost', label: 'Horror' },
                9648: { icon: 'fas fa-user-secret', label: 'Mystery' },
                10749: { icon: 'fas fa-heart', label: 'Romance' },
                878: { icon: 'fas fa-robot', label: 'Sci-Fi' },
                53: { icon: 'fas fa-dizzy', label: 'Thriller' },
                37: { icon: 'fas fa-hat-cowboy', label: 'Western' },
                10751: { icon: 'fas fa-home', label: 'Family' }
            }

            //loop through genres and append corresponding icon + label
            genreArray.forEach(genre => {
                if (genreIcons[genre]) {
                    const iconEl = document.createElement('i');
                    iconEl.setAttribute('class', genreIcons[genre].icon);
                    iconEl.setAttribute('title', genreIcons[genre].label);
                    iconEl.setAttribute('aria-label', genreIcons[genre].label);
                    
                    //update color of selected item
                    if (genreID == genre) {
                        iconEl.setAttribute('style', 'background-color: goldenrod;')
                    }
                    genreValue.appendChild(iconEl);
                }
            });

            genreContainer.append(genreHeader, genreValue);

            //create + append overview text
            const overview = document.createElement('p');
            overview.textContent = movieApp.movie.overview;
            overview.classList.add('overview');

            //create release date container
            const releaseDtContainer = document.createElement('div');
            releaseDtContainer.classList.add('sub-heading');

            //append release date header and value
            const releaseDtHeader = document.createElement('h3');
            releaseDtHeader.textContent = 'Release Date: ';
            const releaseDtValue = document.createElement('p');
            releaseDtValue.textContent = movieApp.movie.release_date;
            
            releaseDtContainer.append(releaseDtHeader, releaseDtValue)

        //add base elements to page
            //add movie title
            movieApp.resultsContainer.appendChild(document.createElement('h2')).textContent = movieApp.movie.title;

            //create details container + append to results container
            const movieDetailsContainer = document.createElement('div');
            movieDetailsContainer.classList.add('movie-details')
            movieApp.resultsContainer.appendChild(movieDetailsContainer);
            
            //append all overview items to overview container
            overviewContainer.append(overviewTitle, ratingsContainer, overview, releaseDtContainer, genreContainer);

            //append image and all overview items to details container
            movieDetailsContainer.append(posterImgContainer, overviewContainer);

        //add dynamic elements to page
            //add movie trailer button, if trailer found
            if (trailerKey) {
                const trailerBtn = document.createElement('a');
                trailerBtn.classList.add('button');
                trailerBtn.setAttribute('target', '_blank');
                trailerBtn.href = 'https://www.youtube.com/watch?v=' + trailerKey;
                trailerBtn.textContent = '   Play Trailer';
                overviewContainer.appendChild(trailerBtn);
            }

            //add button for more results, if simlar movies found
            if (similarMovies) {
                const similarMoviesBtn = document.createElement('button');
                similarMoviesBtn.setAttribute('id', 'similar-button')
                similarMoviesBtn.textContent = 'Find Similar Movies';
                movieApp.resultsContainer.appendChild(similarMoviesBtn)
            }
            
        //scroll to movie result section
            movieApp.resultsContainer.scrollIntoView( { behavior: 'smooth' });
    } else {

        //display error message movie variable not populated
        const errMsg = document.createElement('h3');
        errMsg.textContent = "Hmmm, we appear to be having technical difficulties, please try again later.";
        movieApp.resultsContainer.style.textAlign = 'center';
        movieApp.resultsContainer.appendChild(errMsg);
    }
}


//display similar movies
movieApp.displaySimilarMovies = () => {

    //adding container for similar movies
    const similarMoviesContainer = document.createElement('div');
    similarMoviesContainer.classList.add('similar-movies')

    //add header
    const moreLikeThis = document.createElement('h2');
    moreLikeThis.textContent = 'More Like This:';
    movieApp.resultsContainer.appendChild(moreLikeThis);

    //loop through similar movie array
    for (let i = 0; i <= 2; i++) {
        const movie = movieApp.similarMoviesArr[i]

        //creating a div for each separate movie
        const movieContainer = document.createElement('div');
        similarMoviesContainer.appendChild(movieContainer);

        //creating a div for images
        const posterImgContainer = document.createElement('div');
        posterImgContainer.classList.add('movie-img');
        const posterImg = document.createElement('img');
        posterImg.src = "https://image.tmdb.org/t/p/w500/" + movie.poster_path;
        posterImg.alt = movie.title + " movie poster";
        posterImgContainer.appendChild(posterImg);

        //add image to movie container
        movieContainer.appendChild(posterImgContainer);

        //add to page
        movieApp.resultsContainer.appendChild(similarMoviesContainer)

        //scroll to similar movie result container
        similarMoviesContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

//||||| helper functions |||||
//create star icons
movieApp.addStars = (iconClass, iconContainer, num = 10) => {
    for (let j = 0; j < num; j++) {
        const starIcon = document.createElement('i')
        starIcon.setAttribute("class", iconClass);
        iconContainer.appendChild(starIcon);
    }
}

//reformat date
movieApp.reformatDate = (dt, dashes) => {
    const date = new Date(dt);
    const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
    const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);

    //if format with dashes, set month format as numeric, else short
    if (dashes) {
        const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
        return `${year}-${month}-${day}`;
    } else {
        const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
        return `${month} ${day}, ${year}`;
    }
}

//select random array item
movieApp.randomItem = (arr) => {
    const randomEl = Math.floor(Math.random() * arr.length);
    return arr[randomEl];
}

//||||| initialize |||||
movieApp.init = () => {

    const formEl = document.querySelector('form');
    
    //add submit event listener
    formEl.addEventListener('submit', (event) => {
        event.preventDefault();
        const genre = document.querySelector('input[name="genre"]:checked');

        //call getData function
        movieApp.getData(genre.value)
    });

    movieApp.resultsContainer = document.querySelector('#movie-results-section div');

    movieApp.resultsContainer.addEventListener('click',(event)=>{
        if(event.target.localName === "button"){          
            movieApp.displaySimilarMovies(); 
            event.target.style.display="none";
        }
    })    
};

movieApp.init();