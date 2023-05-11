const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  uuid = require("uuid");

app.use(bodyParser.json());

let users = [
  { id: 1, name: "Bill", favoriteMovies: [] },

  { id: 2, name: "Maria", favoriteMovies: ["Hook"] },

  { id: 3, name: "Spongebob", favoriteMovies: ["The Shining"] },
];

let movies = [
  {
    Title: "Eternal Sunshine of the Spotless Mind",
    Released: 2004.0,
    Actors: "Jim Carrey, Kate Winslet",
    Genre: {
      Name: "Drama",
      Description: [],
    },

    Director: {
      Name: "Michael Gondry",
      Birth: 1963.0,
    },
    ImageURL: [],
    Featured: [],
  },

  {
    Title: "Hook",
    Released: 1991.0,
    Actors: "Robin Williams, Dustin Hoffman, Julia Roberts",
    Genre: {
      Name: "Adventure",
      Description: [],
    },

    Director: {
      Name: "Steven Spielberg",
      Birth: 1946.0,
    },
    ImageURL: [],
    Featured: [],
  },

  {
    Title: "Labyrinth",
    Released: 1986.0,
    Actors: "David Bowie, Jennifer Connelly",
    Genre: {
      Name: "Fantasy",
      Description: [],
    },

    Director: {
      Name: "Jim Henson",
      Birth: 1936.0,
    },
    ImageURL: [],
    Featured: [],
  },

  {
    Title: "Harry Potter and the Sorcerer's Stone",
    Released: 2001.0,
    Actors: "Daniel Radcliffe, Emma Watson, Rupert Grint",
    Genre: {
      Name: "Fantasy",
      Description: [],
    },

    Director: {
      Name: "Chris Columbus",
      Birth: 1958.0,
    },
    ImageURL: [],
    Featured: [],
  },

  {
    Title: "Stand by Me",
    Released: 1986.0,
    Actors: "Jerry O'Connell, Corey Feldman, Kiefer Sutherland",
    Genre: {
      Name: "Adventure",
      Description: [],
    },

    Director: {
      Name: "Rob Reiner",
      Birth: 1947.0,
    },
    ImageURL: [],
    Featured: [],
  },

  {
    Title: "Eat, Pray, Love",
    Released: 2010.0,
    Actors: "Julia Roberts, Javier Bardem",
    Genre: {
      Name: "Romance",
      Description: [],
    },

    Director: {
      Name: "Ryan Murphy",
      Birth: 1965.0,
    },
    ImageURL: [],
    Featured: [],
  },

  {
    Title: "The Princess Bride",
    Released: 1987.0,
    Actors: "Cary Elwes, Robin Wright, Billy Crystal",
    Genre: {
      Name: "Adventure",
      Description: [],
    },

    Director: {
      Name: "Rob Reiner",
      Birth: 1947.0,
    },
    ImageURL: [],
    Featured: [],
  },

  {
    Title: "The Shining",
    Released: 1980.0,
    Actors: "Jack Nicholson, Shelley Duvall",
    Genre: {
      Name: "Horror",
      Description: [],
    },

    Director: {
      Name: "Stanley Kubrick",
      Birth: 1928.0,
    },
    ImageURL: [],
    Featured: [],
  },

  {
    Title: "Willy Wonka and the Chocolate Factory",
    Released: 1971.0,
    Actors: "Gene Wilder, Peter Ostrum",
    Genre: {
      Name: "Fantasy",
      Description: [],
    },

    Director: {
      Name: "Mel Stuart",
      Birth: 1928.0,
    },
    ImageURL: [],
    Featured: [],
  },

  {
    Title: "Indiana Jones and the Last Crusade",
    Released: 1989.0,
    Actors: "Harrison Ford, Sean Connery, River Phoenix",
    Genre: {
      Name: "Action",
      Description: [],
    },

    Director: {
      Name: "Steven Spielberg",
      Birth: 1946.0,
    },
    ImageURL: [],
    Featured: [],
  },
];

// GET requests
app.use(express.static("public"));
app.use(morgan("common"));
app.get("/", (req, res) => {
  res.send("Welcome to Cinedex!");
});

//Allow new users to register
app.post("/users", (req, res) => {
  const newUser = req.body;
  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send("Users must have a name.");
  }
});

//Allow users to update username
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;
  let user = users.find((user) => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("This user does not exist.");
  }
});

//Allow users to add movies to their favorite movie list
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;
  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res
      .status(200)
      .send(
        `${movieTitle} has been added to user ${id}'s favorite movie list.`
      );
  } else {
    res.status(400).send("This user does not exist.");
  }
});

//Allow users to delete movies from their favorite movie list
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies.filter((title) => title !== movieTitle);
    res
      .status(200)
      .send(
        `${movieTitle} has been deleted from user ${id}'s favorite movie list.`
      );
  } else {
    res.status(400).send("This user does not exist.");
  }
});

//Allows users to delete their account
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    users = users.filter((user) => user.id != id);
    res.status(200).send(`User ${id} has been deleted.`);
  } else {
    res.status(400).send("This user does not exist.");
  }
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

//Return list of all movies
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

//Return data about a single movie by name
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.Title === title);
  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("This movie does not exist.");
  }
});

//Return data about a genre by name
app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.Genre.Name === genreName).Genre;
  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("This genre does not exist.");
  }
});

//Return data about director by name
app.get("/movies/director/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = movies.find((movie) => movie.Name === directorName).Director;
  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("This director does not exist.");
  }
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
