const API_KEY="76e8cdb6";
const searchForm=document.getElementById('myForm');
const searchInput=document.getElementById('myInput');
const movieContainer=document.getElementById('movieBox');
const message=document.getElementById('myParagraph');
const movieDetails=document.getElementById('movieDetails');
searchForm.addEventListener("submit",async function(event){
    event.preventDefault();
    const movieName=searchInput.value.trim();

    if(movieName===""){
        message.textContent="Please enter movie name.";
        return;
    }
    await searchMovie(movieName);
});

async function searchMovie(movieName) {
    movieDetails.style.display = "none";
    movieDetails.replaceChildren();
    movieContainer.replaceChildren();
    message.textContent="Loading....";
    try{
        const url=  `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(movieName)}`;
        const response=await fetch(url);
        if(!response.ok){
            throw new Error("Network Error.Please Try Again Later.");
        }
        const data=await response.json();

        if(data.Response==="False"){
            if(data.Error==="Invalid API key!"){
                throw new Error("Invalid API key. Please check your API key.")
            }
            message.textContent=data.Error||"No movie found. Try another title.";
            return;
        }
        displayMovie(data.Search);
        message.textContent=`Found ${data.totalResults} results for "${movieName}"`;
    }
    catch(err){
        message.textContent=err.message;
    }
}

function displayMovie(movies){
  movieContainer.replaceChildren();
  movies.forEach(function(movie){
    const card=document.createElement("article");
    card.className="movie-card";
    card.addEventListener("click",function(){
        getMovieDetails(movie.imdbID);
    });
    const poster=document.createElement("img");
    poster.alt = `${movie.Title} poster`;
    poster.loading = "lazy";

    if(movie.Poster && movie.Poster!=="N/A"){
      poster.src=movie.Poster;
    }else{
        poster.alt = `Poster unavailable for ${movie.Title}`;
    }
    const info = document.createElement("div");
    info.className = "movie-info";
    const title = document.createElement("h2");
    title.textContent = movie.Title;
    const year = document.createElement("p");
    year.textContent = `Year: ${movie.Year}`;
    const type = document.createElement("p");
    type.textContent = `Type: ${movie.Type}`;
    info.append(title, year, type);
    card.append(poster, info);
    movieContainer.appendChild(card);
  });
}

async function getMovieDetails(imdbID) {
    movieDetails.style.display="grid";
    movieDetails.textContent="Loading movie details...";
    try{
        const url =`https://www.omdbapi.com/?apikey=${API_KEY}&i=${encodeURIComponent(imdbID)}&plot=full`;
        const response=await fetch(url);

        if(!response.ok){
            throw new Error("Network Error. Please Try Again.");
        }
        const movie=await response.json();

        if(movie.Response==="False"){
            throw new Error(movie.Error||"Movie not found.");
        }
        showMovieDetails(movie);
    }
    catch(error){
        movieDetails.textContent=error.message;
    }
}

function showMovieDetails(movie){
   movieDetails.replaceChildren();
   movieDetails.style.display="grid";
   const poster=document.createElement("img");
   poster.alt=`${movie.Title} poster`;

    if (movie.Poster && movie.Poster !== "N/A") {
        poster.src = movie.Poster;
    }

  const info=document.createElement("div");
  const title=document.createElement("h2");
  title.textContent=movie.Title;
  info.appendChild(title);
  const details = [
        ["Year", movie.Year],
        ["Genre", movie.Genre],
        ["Director", movie.Director],
        ["Actors", movie.Actors],
        ["IMDb Rating", movie.imdbRating],
        ["Runtime", movie.Runtime],
        ["Plot", movie.Plot]
    ];

  details.forEach(function(label,value){
    const paragraph=document.createElement("p");
    paragraph.textContent=  `${label}: ${value && value !== "N/A"
                ? value
                : "Not available"}`;
    info.appendChild(paragraph);
  });

  const closeButton=document.createElement("button");
  closeButton.id="closeDetails";
  closeButton.textContent="Close Details";
  closeButton.addEventListener("click",function(){
    movieDetails.style.display="none";
  });
  info.appendChild(closeButton);
  movieDetails.append(poster,info);
}