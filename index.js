const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

const { check, validationResult } = require("express-validator");
const { Movie, User } = require("./models.js");
const passport = require("passport");

require("dotenv").config();

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());

app.use(express.static("public"));
app.use(morgan("common"));

let auth = require("./auth")(app);
require("./passport");

// GET requests
app.get("/", (req, res) => {
  res.send("Welcome to Cinedex!");
});

//Allow new users to register
app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],

  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = User.hashPassword(req.body.Password);
    User.findOne({ Username: req.body.Username }).then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + " " + "already exists");
      } else {
        User.create({
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    });
  }
);

//Allows users to search for a specific user
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById(req.user._id) //passport gets the current user from the token and saves the user data in req.user
      .select("-Password")
      .populate("FavoriteMovies")
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Allow users to update user profile information

app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const userEditInfo = {
      Username: req.body.Username,
      Email: req.body.Email,
      Birthday: req.body.Birthday,
    };

    if (
      typeof req.body.Password == "string" &&
      req.body.Password.trim().length > 0
    ) {
      userEditInfo.Password = User.hashPassword(req.body.Password);
    }

    User.findOneAndUpdate(
      { _id: req.user._id }, //passport gets the current user from the token and saves the user data in req.user
      {
        $set: userEditInfo,
      },
      { new: true }
    )
      .then((updatedUser) => {
        res.status(200).json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Allow users to add movies to their favorite movie list

app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $addToSet: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }
    )
      .then(() => {
        res
          .status(200)
          .send(
            req.params.MovieID + " was added to your Favorite Movies list."
          );
      })
      .catch((err) => {
        res.status(500).send("Error: " + err);
      });
  }
);

//Allow users to delete movies from their favorite movie list

app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $pull: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }
    )
      .then(() => {
        res
          .status(200)
          .send(req.params.MovieID + " was deleted from Favorite Movies List.");
      })
      .catch((err) => {
        res.status(500).send("Error: " + err);
      });
  }
);

//Allows users to delete their account

app.delete("/users/:Username", (req, res) => {
  User.findOneAndRemove({ Username: req.params.Username })
    .then(() => {
      res.status(200).json({ message: req.params.Username + " was deleted." });
    })
    .catch((err) => {
      res.status(500).send("Error: " + err);
    });
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

//Return list of all movies

app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movie.find()
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Return data about a single movie by name

app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movie.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Return data about a genre by name

app.get(
  "/movies/genre/:genreName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movie.findOne({ "Genre.Name": req.params.genreName }, "Genre")
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Return data about director by name

app.get(
  "/movies/director/:directorName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movie.find({ "Director.Name": req.params.directorName }, "Director")
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//error-handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// listen for requests
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("Listening on port " + port);
});
