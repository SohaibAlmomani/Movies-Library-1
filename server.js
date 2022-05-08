"use strict";

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

const moviesData = require("./movie-data/data.json");
const url = "postgres://yaseinburqan:6437@localhost:5432/moviedatabase";
const bodyParser = require("body-parser");

const axios = require("axios");
const dotenv = require("dotenv");
//const pg = require("pg");

const { Client } = require("pg");
const client = new Client(url);

const apiKey = process.env.apiKey;
const pg = require("pg");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
dotenv.config();

function MoviesLibrary(title, posterPath, overview) {
  this.title = title;
  this.posterPath = posterPath;
  this.overview = overview;
}

// after connection to db, start the server
client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening ${PORT}`);
  });
});

// endpoints handling functions
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

let handleFavoritePage = (req, res) => {
  return res.status(200).send("Favorite Page");
};

function handleGetMovie(req, res) {
  let id = req.params.id;
  let sql = `SELECT * FROM movies WHERE id=${id};`;
  client.query(sql).then((data) => {
    res.status(200).json(data.rows);
  });
}

function handleDeleteMovie(req, res) {
  const { id } = req.params;
  console.log(id);
  const sql = `DELETE FROM movies WHERE id=${id};`;
  client.query(sql).then(() => {
    return res.status(204).json([]);
  });
}

const handleError = (req, res) => {
  return res.status(404).send("page not found");
};

// end points
app.get("/home", handleHomePage);
app.post("/movie", handleAddMovie);
app.get("/favorite", handleFavoritePage);
app.put("/update", handleUpdateMovie);
app.put("/delete", handleDeleteMovie);
app.put("/getMovie", handleGetMovie);
app.get("*", handleError);
