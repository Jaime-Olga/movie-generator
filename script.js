// MOVIE GENERATOR APP
// 1.	A landing page with the app HEADING and form containing list of GENRE radio buttons, RELEASE DATE ranges and minimum POPULARITY score in dropdown menu format with SUBMIT button.
// 2.	Listen to release date dropdown change events, if both dropdowns contain a value, validate to ensure they are within a valid range.Display error if selection is incorrect.
// 3.	Listen to submit button click event and validate that all form inputs have been completed.Display error if incomplete.
// 4.	Following successful form validation, execute API call, passing the input data as paramaters to return filtered list of movies.
// 5.	Select a random movie from returned movie list.
// 6.	Clear any previously displayed movies and display the following properties from the randomly selected movie: title, poster, overview, average vote count, release date.

const movieApp = {};

//get movie options from TMDB API
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

            //filter returned array to exclude those without a poster path
            const newArr = jsonResponse.results.filter((el) => {
                if (el.poster_path) {
                    return el;
                };
            });

            //select random movie
            const movie = movieApp.randomItem(newArr);

            //call function to display movie
            movieApp.displayMovie(movie);
        })
    }

//display random movie
movieApp.displayMovie = (movie) => {

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
        const resultsContainer = document.querySelector('.movie-results-section div');
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

        //append image and all overview items to details container
        movieDetailsContainer.appendChild(posterImgContainer);
        movieDetailsContainer.appendChild(overviewContainer);
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
    
};

movieApp.init();


