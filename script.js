// MOVIE GENERATOR APP

// 1. A landing page with the app HEADING and list of GENRES in radio format with RELEASE DATE range in dropdown menu format and SOBMIT button.

// 2.Listen to the button click event and use the user input data as a key-search value for filtering data.

// 3.Display the most popular movie with title/poster/overview information filtered by user input.

// 4. Dynemic button "Similar movies" that onclick shows next 5 movies fitted user input.







console.log("hello")


const url = new URL('https://api.themoviedb.org/3/discover/movie')
url.search = new URLSearchParams({
    api_key: 'be004bf3fc203fe839ccb38c47ddc0ee',
    sort_by: 'popularity.desc',
    // year : '1993'
    primary_release_year: 1992,
    page: 1
    
})

fetch(url)
    .then(function (response) {
        //parse the response into JSON
        return response.json()
    }).then(function (jsonResponse) {
        // work with the data from the API
        console.log(jsonResponse)
    })