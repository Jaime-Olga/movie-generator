// MOVIE GENERATOR APP
// 1.	A landing page with the app HEADING and form containing list of GENRE radio buttons, RELEASE DATE ranges and minimum POPULARITY score in dropdown menu format with SUBMIT button.
// 2.	Listen to release date dropdown change events, if both dropdowns contain a value, validate to ensure they are within a valid range.Display error if selection is incorrect.
// 3.	Listen to submit button click event and validate that all form inputs have been completed.Display error if incomplete.
// 4.	Following successful form validation, execute API call, passing the input data as paramaters to return filtered list of movies.
// 5.	Select a random movie from returned movie list.
// 6.	Clear any previously displayed movies and display the following properties from the randomly selected movie: title, poster, overview, average vote count, release date.

const movieApp = {};
movieApp.resultsContainer = document.querySelector('#movie-results-section div');
movieApp.movieID = '';
movieApp.baseURL = 'https://api.themoviedb.org/3/';
movieApp.apiKey = 'be004bf3fc203fe839ccb38c47ddc0ee';
//get movie options from TMDB API
movieApp.getData = (genre) => {
    const url = new URL(movieApp.baseURL + 'discover/movie')
    url.search = new URLSearchParams({
        api_key: movieApp.apiKey,
        with_original_language: 'en',
        with_genres: genre
        // 'primary_release_date.gte': '2021-01-01',
        // 'primary_release_date.lte': movieApp.getTodaysDate()
    })

    fetch(url)
        .then(function (response) {
            //parse the response into JSON
            return response.json()
        }).then(function (jsonResponse) {

            //filter returned array to exclude those without a poster path
            const newArr = jsonResponse.results.filter((el) => {
                if (el.poster_path) {
                    return el;
                };
            });

            //select random movie
            const movie = movieApp.randomItem(newArr);
            movieApp.movieID = movie.id;

            //display movie
            movieApp.displayMovie(movie, genre);
        })
    }
    //Gettting similar movies
movieApp.getSimilarMovies = () => {
        const url = new URL(movieApp.baseURL + 'movie/'+ movieApp.movieID + '/similar')
        url.search = new URLSearchParams({
            api_key: movieApp.apiKey,
            // language: 'en'                   
        })

        fetch(url)
            .then(function (response) {
                //parse the response into JSON
                return response.json()
            }).then(function (jsonResponse) {

                //filter returned array to exclude those without a poster path
                const newArr = jsonResponse.results.filter((el) => {
                    if (el.poster_path) {                        
                        return el;
                        
                    };                    
                });
                //show more like this                
                movieApp.displaySimilarMovies(newArr);
            })
    }
//display similar movies
movieApp.displaySimilarMovies =(array)=> {
    console.log(movieApp.movieID)
    console.log(array)
    //adding container for similar movies
    if(array.length){
    const similarMoviesContainer = document.createElement('div');
    similarMoviesContainer.classList.add('similar-movies')
    console.log(similarMoviesContainer)    
    // const similarMoviesContainer = document.createElement('#more-movies');

    const moreLikeThis = document.createElement('h2');
    moreLikeThis.textContent = 'More Like this:';
    movieApp.resultsContainer.appendChild(moreLikeThis);    

    for(let i=0; i<=2; i++){
        const movie = array[i]
        console.log(array)
        console.log(array[i])  
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
        movieContainer.appendChild(posterImgContainer);

        movieApp.resultsContainer.appendChild(similarMoviesContainer)        
        }
    }else{
        console.log('no array')
    }
}


//display random movie
movieApp.displayMovie = (movie, genreID) => {

    //construct elements
        //create poster img container
        const posterImgContainer = document.createElement('div');
        posterImgContainer.classList.add('movie-img');

        //append poster image to container
        const posterImg = document.createElement('img');
        posterImg.src = "https://image.tmdb.org/t/p/w500/" + movie.poster_path;
        posterImg.alt = movie.title + " movie poster";
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
        starContainer.appendChild(starEmptyContainer);
        starContainer.appendChild(starFilledContainer);

        //add sr-only rating text
        const srText = document.createElement('p');
        srText.classList.add('sr-only');
        srText.textContent = `Vote Average: ${movie.vote_average} / 10`
        ratingsContainer.appendChild(srText);

        //add stars
        movieApp.addStars('fa fa-star', starFilledContainer);
        movieApp.addStars('far fa-star', starEmptyContainer);

        //update width of filled stars to rating value
        starFilledContainer.setAttribute('style', `width: ${movie.vote_average * 10}%;`);

        //add vote count
        const voteCnt = document.createElement('p');
        voteCnt.textContent = `(${movie.vote_count} votes)`;
        ratingsContainer.appendChild(voteCnt);

        //create genre container
        const genreContainer = document.createElement('div');
        genreContainer.classList.add('sub-heading');
        const genreHeader = document.createElement('h3');
        genreHeader.textContent = 'Genres: ';
        const genreValue = document.createElement('div');
        genreValue.classList.add('genre-thumbnails');

        //genre IDs in selected movie
        const genreArray = movie.genre_ids;
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

        genreContainer.appendChild(genreHeader);
        genreContainer.appendChild(genreValue);


    //append items to container
        //create + append overview text
        const overview = document.createElement('p');
        overview.textContent = movie.overview;
        overview.classList.add('overview');

        //create release date container
        const releaseDtContainer = document.createElement('div');
        releaseDtContainer.classList.add('sub-heading');

        //append release date header and value
        const releaseDtHeader = document.createElement('h3');
        releaseDtHeader.textContent = 'Release Date: ';
        const releaseDtValue = document.createElement('p');
        releaseDtValue.textContent = movie.release_date;
        
        releaseDtContainer.appendChild(releaseDtHeader)
        releaseDtContainer.appendChild(releaseDtValue);

    //add to page
        //locate + clear results container
        const resultsContainer = document.querySelector('#movie-results-section div');
        resultsContainer.innerHTML = '';
        resultsContainer.classList.add('movie-results-container');

        //add movie title
        resultsContainer.appendChild(document.createElement('h2')).textContent = movie.title;

        //create details container + append to results container
        const movieDetailsContainer = document.createElement('div');
        movieDetailsContainer.classList.add('movie-details')
        resultsContainer.appendChild(movieDetailsContainer);
        
        //append all overview items to overview container
        overviewContainer.appendChild(overviewTitle);
        overviewContainer.appendChild(ratingsContainer);
        overviewContainer.appendChild(overview);
        overviewContainer.appendChild(releaseDtContainer);
        overviewContainer.appendChild(genreContainer);

        //append image and all overview items to details container
        movieDetailsContainer.appendChild(posterImgContainer);
        movieDetailsContainer.appendChild(overviewContainer);

        //scroll to movie result section
        document.getElementById("movie-results-section").scrollIntoView({ behavior: 'smooth' });

        //button for more results
        const btn = document.createElement('button');
        btn.setAttribute('id','similar-button')    
        btn.textContent = 'Similar Movies';
        resultsContainer.appendChild(btn)
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
movieApp.reformatDate = (dt) => {
    const date = new Date(dt);
    const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
    const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
    const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
    return `${month} ${day}, ${year}`;
}

//select random item
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

    movieApp.resultsContainer.addEventListener('click',(event)=>{
        if(event.target.localName === "button"){          
            movieApp.getSimilarMovies(); 
            event.target.style.display="none";
        }
    })    
};

movieApp.init();


