"use strict";

const express = require("express");
const app = express();
const port = 3000;
const moviesData = require("./Movie-Data/data.json");

function handleListen(port) {}

function MoviesLibrary(title, posterPath, overview) {
  this.title = title;
  this.posterPath = posterPath;
  this.overview = overview;
}

app.get("/home", handleHomePage);
app.get("/favorite", handleFavoritePage);
app.get("/movie", handleMovie);
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

const handleError = (req, res) => {
  return res.status(404).send("page not found");
};
