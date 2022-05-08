"use strict";

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

const moviesData = require("./Move Data/data.json");
const url = "postgres://yaseinburqan:6437@localhost:5432/moviedatabase";
const bodyParser = require("body-parser");

const { Client } = require("pg");
const client = new Client(url);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function MoviesLibrary(title, posterPath, overview) {
  this.title = title;
  this.posterPath = posterPath;
  this.overview = overview;
}

app.use(cors());

// after connection to db, start the server
client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening ${PORT}`);
  });
});

let handleAddMovie = (req, res) => {
  const { name, time, summary, image } = req.body;

  let sql = "INSERT INTO movie(name,time,summary,image ) VALUES($1, $2, $3, $4) RETURNING *;"; // sql query
  let values = [name, time, summary, image];
  client
    .query(sql, values)
    .then((result) => {
      console.log(result.rows);
      return res.status(201).json(result.rows[0]);
    })
    .catch();
};

let handleHomePage = (req, res) => {
  let sql = "SELECT * from movie;";
  client
    .query(sql)
    .then((result) => {
      console.log(result);
      res.json(result.rows);
    })
    .catch((err) => {
      handleError(err, req, res);
    });
  return res.status(200).json(moviesLibrary);
};

let handleFavoritePage = (req, res) => {
  return res.status(200).send("Favorite Page");
};

const handleError = (req, res) => {
  return res.status(404).send("page not found");
};

app.post("/movie", handleAddMovie);
app.get("/home", handleHomePage);
app.get("/favorite", handleFavoritePage);
app.get("*", handleError);
