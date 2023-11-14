require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");

const mongoose = require("mongoose");
const cors = require("cors");

const { check, validationResult } = require("express-validator");
const { Movie, User } = require("./models.js");
const passport = require("passport");

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

/**
 * Default route for handling GET requests.
 * @name GET /
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

app.get("/", (req, res) => {
  res.send("Welcome to Cinedex!");
});

/**
 * Endpoint for user registration.
 * @name POST /users
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

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
/**
 * Retrieve information about the currently authenticated user.
 * @name GET /users
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

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
/**
 * Update user profile information.
 * @name PUT /users/:Username
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

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
/**
 * Add a movie to the user's favorite movies list.
 * @name POST /users/:Username/movies/:MovieID
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

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
/**
 * Remove a movie from the user's favorite movies list.
 * @name DELETE /users/:Username/movies/:MovieID
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

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
/**
 * Delete a user account.
 * @name DELETE /users/:Username
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

app.delete("/users/:Username", (req, res) => {
  User.findOneAndRemove({ Username: req.params.Username })
    .then(() => {
      res.status(200).json({ message: req.params.Username + " was deleted." });
    })
    .catch((err) => {
      res.status(500).send("Error: " + err);
    });
});
/**
 * Serve documentation page.
 * @name GET /documentation
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});
/**
 * Get a list of all movies.
 * @name GET /movies
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

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
/**
 * Get data about a single movie by name.
 * @name GET /movies/:Title
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

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
/**
 * Get data about a genre by name.
 * @name GET /movies/genre/:genreName
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

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
/**
 * Get data about a director by name.
 * @name GET /movies/director/:directorName
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

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
/**
 * Error-handling middleware.
 * @name use-error-handler
 * @function
 * @param {Object} err - Error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function.
 */

app.use((err, req, res, next) => {
  console.log(err);
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
/**
 * Listen for requests.
 * @name listen
 * @function
 * @param {number} port - Port number.
 */
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("Listening on port " + port);
});
