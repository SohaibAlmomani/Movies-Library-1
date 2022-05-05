const express = require("express");

const app = express();

function MoviesLibrary(title, posterPath, overview) {
  this.title = title;
  this.posterPath = posterPath;
  this.overview = overview;
}

app.listen(3000, () => {
  console.log("listening to port 3000");
});

const moviesData = require("./Movie-Data/data.json");

let homePageHandler = (req, res) => {
  let moviesLibrary = [];
  moviesData.data.forEach((movie) => {
    movie = new MoviesLibrary(movie.title, movie.posterPath, movie.overview);
    moviesLibrary.push(movie);
  });
  return res.status(500).json(moviesLibrary);
};

app.get("/", homePageHandler);

let favoritePageHandler = (req, res) => {
  return res.status(500).send("To be filled");
};

app.get("/favorite", favoritePageHandler);

const pageNotFoundHandler = (req, res) => {
  return res.status(404).send({
    status: 404,
    responseText: "page not found",
  });
};

app.get("*", pageNotFoundHandler);

const errorHandler = (err, req, res) => {
  res.send({
    status: 500,
    responseText: "Sorry, something went wrong",
  });
};

app.use(errorHandler);
