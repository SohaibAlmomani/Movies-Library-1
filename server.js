"use strict";

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

const moviesData = require("./movie-data/data.json");
const url = "process.env.dbUrl";
const bodyParser = require("body-parser");

const { Client } = require("pg");
const client = new Client(url);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function handleListen(port) {}

function MoviesLibrary(title, posterPath, overview) {
  this.title = title;
  this.posterPath = posterPath;
  this.overview = overview;
}

app.get("/home", handleHomePage);
app.get("/favorite", handleFavoritePage);
app.get("/movie", handleMovie);
app.get("/getMovieById/:id", handleGetMovieById);
app.get("/trending", trendingPageHandler);
app.get("*", handleError);

app.listen(3000, () => {
  console.log("listening to port 3000");
});

let handleHomePage = (req, res) => {
  return res.status(500).json(moviesLibrary);
};

let handleFavoritePage = (req, res) => {
  return res.status(500).send("Favorite Page");
};

let handleMovie = (req, res) => {
  let newMovie = new MoviesLibrary(newMovie.title, newMovie.posterPath, newMovie.overview);
  moviesLibrary.push(newMovie);
  return res.status(500).send(newMovie);
};

function trendingPageHandler(req, res) {
  let trendingMovies = [];
  axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.apiKey}&language=en-US`).then((value) => {
    value.data.results.forEach((movie) => {
      movie = new MoviesLibrary(movie.title, movie.poster_path, movie.overview);
      trendingMovies.push(movie);
    });
    return res.status(200).json(trendingMovies);
  });
}

function handleGetMovieById(req, res) {
  let id = req.params.id;
  let sql = `SELECT * FROM movie WHERE id=${id};`;
  client.query(sql).then((result) => {
    res.status(200).json(result.rows);
  });
}

const handleError = (req, res) => {
  return res.status(404).send("page not found");
};
