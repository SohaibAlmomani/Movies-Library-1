"use strict";

const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
//const axios = require("axios");
//const dotenv = require("dotenv");
const PORT = process.env.PORT || 3001;
const bodyParser = require("body-parser");
const urlDb = "postgres://yaseinburqan:6437@localhost:5432/moviedatabase";
const { Client } = require("pg");
const apiKey = process.env.API_KEY;
const client = new Client(urlDb);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
dotenv.config();

function MoviesLibrary(title, posterPath, overview) {
  this.title = title;
  this.posterPath = posterPath;
  this.overview = overview;
}

// endpoints handling functions
let handleHomePage = (req, res) => {
  let sql = "SELECT * from movie;";
  client
    .query(sql)
    .then((result) => {
      return res.status(200).json(result.rows);
    })
    .catch((err) => {
      handleError(err, req, res);
    });
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

let handleAddMovie = (req, res) => {
  const { name, time, summary, image } = req.body;
  let sql = "INSERT INTO movie(name,time,summary,image ) VALUES($1, $2, $3, $4) RETURNING *;"; // sql query
  let values = [name, time, summary, image];
  client
    .query(sql, values)
    .then((result) => {
      return res.status(201).json(result.rows[0]);
    })
    .catch();
};

let handleUpdateMovie = (req, res) => {
  const id = req.params.id;
  // req.body.comment;
  const comment = req.body.comment;
  //comment.push(req.body.comment);
  const sql = `UPDATE movie SET comment=$1 WHERE id=${id} RETURNING *;`;
  console.log("handleUpdateMovie");
  const values = [comment];
  client
    .query(sql, values)
    .then((data) => {
      return res.status(201).json(data.rows);
    })
    .catch();
};

let handleFavoritePage = (req, res) => {
  return res.status(200).send("Favorite Page");
};

function handleGetMovieById(req, res) {
  let id = req.params.id;
  let sql = `SELECT * FROM movie WHERE id=${id};`;
  client.query(sql).then((result) => {
    res.status(200).json(result.rows);
  });
}

function handleDeleteMovie(req, res) {
  const { id } = req.params;
  console.log(id);
  const sql = `DELETE  FROM movie WHERE id=${id};`;
  client.query(sql).then(() => {
    return res.status(204).json([]);
  });
}

function handleError(req, res) {
  return res.status(404).send("page not found");
}

// end points
app.get("/home", handleHomePage);
app.get("/trending", trendingPageHandler);
app.post("/addMovie", handleAddMovie);
app.get("/favorite", handleFavoritePage);
app.put("/update/:id", handleUpdateMovie);
app.delete("/delete/:id", handleDeleteMovie);
app.get("/getMovieById/:id", handleGetMovieById);
app.get("*", handleError);

client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening ${PORT}`);
  });
});
