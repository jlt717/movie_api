const express = require("express");
const morgan = require("morgan");
const app = express();
let topMovies = [
  {
    title: "Eternal Sunshine of the Spotless Mind",
    released: "2004",
    actors: "Jim Carrey, Kate Winslet",
  },
  {
    title: "Hook",
    released: "1991",
    actors: "Robin Williams, Dustin Hoffman, Julia Roberts",
  },
  {
    title: "Labyrinth",
    released: "1986",
    actors: "David Bowie, Jennifer Connelly",
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    released: "2001",
    actors: "Daniel Radcliffe, Emma Watson, Rupert Grint",
  },
  {
    title: "Stand by Me",
    released: "1986",
    actors: "Jerry O'Connell, Corey Feldman, Kiefer Sutherland",
  },
  {
    title: "Eat, Pray, Love",
    released: "2010",
    actors: "Julia Roberts, Javier Bardem",
  },
  {
    title: "The Princess Bride",
    released: "1987",
    actors: "Cary Elwes, Robin Wright, Billy Crystal",
  },
  {
    title: "The Shining",
    released: "1980",
    actors: "Jack Nicholson, Shelley Duvall",
  },
  {
    title: "Willy Wonka and the Chocolate Factory",
    released: "1971",
    actors: "Gene Wilder, Peter Ostrum",
  },
  {
    title: "Indiana Jones and the Last Crusade",
    released: "1989",
    actors: "Harrison Ford, Sean Connery, River Phoenix",
  },
];

// GET requests
app.use(express.static("public"));
app.use(morgan("common"));
app.get("/", (req, res) => {
  res.send("Welcome to Cinedex!");
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.get("/movies", (req, res) => {
  res.json(topMovies);
});

//error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
