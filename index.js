const mongoose = require("mongoose");
const Models = require("./models.js");
const Movies = Models.Movie;
const Users = Models.User;
// const Directors = Models.Director;
// const Genres = Models.Genre;
const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  uuid = require("uuid");
mongoose.connect("mongodb://127.0.0.1:27017/CinedexDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// let users = [
//   {
//     id: 1,
//     Username: "Bill",
//     Password: "riff#43raff",
//     Email: "billbrooks@yahoo.com",
//     Birthdate: "8/13/1956",
//     FavoriteMovies: ["Eternal Sunshine of the Spotless Mind"],
//   },

//   {
//     id: 2,
//     Username: "Maria",
//     Password: "eey00re",
//     Email: "westsidestory@gmail.com",
//     Birthdate: "7/19/1960",
//     FavoriteMovies: ["Hook"],
//   },

//   {
//     id: 3,
//     Username: "Spongebob",
//     Password: "Gary549",
//     Email: "pineappleunderthesea@msn.com",
//     Birthdate: "5/25/1990",
//     FavoriteMovies: ["The Shining"],
//   },

//   {
//     id: 4,
//     Username: "Luigi",
//     Password: "itsameluigi2",
//     Email: "hauntedmansion3@hotmail.com",
//     Birthdate: "3/13/1968",
//     FavoriteMovies: ["Labyrinth", "Hook"],
//   },

//   {
//     id: 5,
//     Username: "Princess Peach",
//     Password: "one2bucklemyshoe",
//     Email: "princesspeach@aol.com",
//     Birthdate: "12/23/1970",
//     FavoriteMovies: [
//       "The Shining",
//       "Eternal Sunshine of the Spotless Mind",
//       "The Princess Bride",
//     ],
//   },
// ];

// let movies = db.movies.insertMany([
//   {
//     Title: "Eternal Sunshine of the Spotless Mind",
//     Released: 2004,
//     Description:
//       "After a fight, Joel Barish discovers that his girlfriend, Clementine Kruczynski, has had her memories of him erased by the New York City firm Lacuna. Heartbroken, he decides to undergo the same procedure. In preparation, he records a tape for Lacuna, recounting his memories of their volatile relationship.",
//     Genre: {
//       Name: "Drama",
//       Description:
//         "The drama genre features stories with high stakes and many conflicts. They're plot-driven and demand that every character and scene move the story forward. Dramas follow a clearly defined narrative plot structure, portraying real-life scenarios or extreme situations with emotionally-driven characters.",
//     },

//     Director: {
//       Name: "Michel Gondry",
//       Bio: "Michel Gondry is a French filmmaker noted for his inventive visual style and distinctive manipulation of mise en scène.",
//       Birth: 1963,
//     },
//     ImageURL:
//       "https://m.media-amazon.com/images/M/MV5BMTY4NzcwODg3Nl5BMl5BanBnXkFtZTcwNTEwOTMyMw@@._V1_.jpg",
//     Featured: false,
//   },

//   {
//     Title: "Hook",
//     Released: 1991,
//     Description:
//       "When Captain James Hook kidnaps his children, an adult Peter Pan must return to Neverland and reclaim his youthful spirit in order to challenge his old enemy. This is a sequel to Peter Pan.",
//     Genre: {
//       Name: "Adventure",
//       Description:
//         "Adventure film is a genre that revolves around the conquests and explorations of a protagonist. The purpose of the conquest can be to retrieve a person or treasure, but often the main focus is simply the pursuit of the unknown. These films generally take place in exotic locations and play on historical myths.",
//     },

//     Director: {
//       Name: "Steven Spielberg",
//       Bio: "Steven Spielberg is an American filmmaker. A major figure of the New Hollywood era and pioneer of the modern blockbuster, he is the most commercially successful director in history.",
//       Birth: 1946,
//     },
//     ImageURL:
//       "https://m.media-amazon.com/images/M/MV5BNmJjNTQzMjctMmE2NS00ZmYxLWE1NjYtYmRmNjNiMzljOTc3XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_FMjpg_UX1000_.jpg",
//     Featured: false,
//   },

//   {
//     Title: "Labyrinth",
//     Released: 1986,
//     Description:
//       "The film stars Jennifer Connelly as 16-year-old Sarah and David Bowie as Jareth, the Goblin King. In Labyrinth, Sarah embarks on a quest to reach the center of an enormous, otherworldly maze to rescue her infant half-brother Toby, whom she wished away to Jareth.",
//     Genre: {
//       Name: "Fantasy",
//       Description:
//         "Fantasy films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds. The genre is considered a form of speculative fiction alongside science fiction films and horror films, although the genres do overlap.",
//     },

//     Director: {
//       Name: "Jim Henson",
//       Bio: "James Maury Henson was an American puppeteer, animator, cartoonist, actor, inventor, and filmmaker who achieved worldwide notability as the creator of The Muppets and Fraggle Rock and director of The Dark Crystal and Labyrinth.",
//       Birth: 1936,
//       Death: 1990,
//     },
//     ImageURL:
//       "https://m.media-amazon.com/images/M/MV5BMjM2MDE4OTQwOV5BMl5BanBnXkFtZTgwNjgxMTg2NzE@._V1_FMjpg_UX1000_.jpg",
//     Featured: true,
//   },

//   {
//     Title: "Harry Potter and the Sorcerer's Stone",
//     Released: 2001,
//     Description:
//       "This story introduces Harry Potter and follows his first year at Hogwarts School of Witchcraft and Wizardry as he discovers that he is a famous wizard and begins his formal wizarding education.",
//     Genre: {
//       Name: "Fantasy",
//       Description:
//         "Fantasy films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds. The genre is considered a form of speculative fiction alongside science fiction films and horror films, although the genres do overlap.",
//     },

//     Director: {
//       Name: "Chris Columbus",
//       Bio: "Chris Columbus is an American filmmaker. Born in Spangler, Pennsylvania, Columbus studied film at Tisch School of the Arts where he developed an interest in filmmaking. After writing screenplays for several teen comedies in the mid-1980s, he made his directorial debut with a teen adventure, Adventures in Babysitting.",
//       Birth: 1958,
//     },
//     ImageURL:
//       "https://m.media-amazon.com/images/M/MV5BNmQ0ODBhMjUtNDRhOC00MGQzLTk5MTAtZDliODg5NmU5MjZhXkEyXkFqcGdeQXVyNDUyOTg3Njg@._V1_.jpg",
//     Featured: false,
//   },

//   {
//     Title: "Stand by Me",
//     Released: 1986,
//     Description:
//       "Based on Stephen King's novel, this film revolves around four small-town 12-year-old boys who set out on a trek to find a dead body. They overcome oncoming trains, a disgusting bout with leeches, and the rival advances of a competing gang to collect the prize of locating the body.",
//     Genre: {
//       Name: "Adventure",
//       Description:
//         "Adventure film is a genre that revolves around the conquests and explorations of a protagonist. The purpose of the conquest can be to retrieve a person or treasure, but often the main focus is simply the pursuit of the unknown. These films generally take place in exotic locations and play on historical myths.",
//     },

//     Director: {
//       Name: "Rob Reiner",
//       Bio: "Rob Reiner is an American actor and filmmaker. As a director, Reiner was recognized by the Directors Guild of America Awards with nominations for the coming of age drama Stand by Me, the romantic comedy When Harry Met Sally, and the military courtroom drama A Few Good Men, the last of which also earned him a nomination for the Academy Award for Best Picture.",
//       Birth: 1947,
//     },
//     ImageURL:
//       "https://m.media-amazon.com/images/I/81PmlArGyfS._AC_UF894,1000_QL80_.jpg",
//     Featured: false,
//   },

//   {
//     Title: "Eat, Pray, Love",
//     Released: 2010,
//     Description:
//       "A married woman realizes how unhappy her marriage really is, and that her life needs to go in a different direction. After a painful divorce, she takes off on a round-the-world journey to find herself.",
//     Genre: {
//       Name: "Romance",
//       Description:
//         "Romance films, romance movies, or ship films involve romantic love stories recorded in visual media for broadcast in theatres or on television that focus on passion, emotion, and the affectionate romantic involvement of the main characters. Typically their journey through dating, courtship or marriage is featured.",
//     },

//     Director: {
//       Name: "Ryan Murphy",
//       Bio: "Ryan Murphy is an American television writer, director, and producer. He has received six Primetime Emmy Awards from 36 nominations, a Tony Award from two nominations, and two Grammy Award nominations. He has often been described as the most powerful man in modern television, and signed the largest development deal in television history with Netflix.",
//       Birth: 1965,
//     },
//     ImageURL:
//       "https://m.media-amazon.com/images/M/MV5BMTY5NDkyNzkyM15BMl5BanBnXkFtZTcwNDQyNDk0Mw@@._V1_FMjpg_UX1000_.jpg",
//     Featured: false,
//   },

//   {
//     Title: "The Princess Bride",
//     Released: 1987,
//     Description:
//       "Adapted by William Goldman from his 1973 novel of the same name, it tells the story of a swashbuckling farmhand named Westley, accompanied by companions befriended along the way, who must rescue his true love Princess Buttercup from the odious Prince Humperdinck.",
//     Genre: {
//       Name: "Adventure",
//       Description:
//         "Adventure film is a genre that revolves around the conquests and explorations of a protagonist. The purpose of the conquest can be to retrieve a person or treasure, but often the main focus is simply the pursuit of the unknown. These films generally take place in exotic locations and play on historical myths.",
//     },

//     Director: {
//       Name: "Rob Reiner",
//       Bio: "Rob Reiner is an American actor and filmmaker. As a director, Reiner was recognized by the Directors Guild of America Awards with nominations for the coming of age drama Stand by Me, the romantic comedy When Harry Met Sally, and the military courtroom drama A Few Good Men, the last of which also earned him a nomination for the Academy Award for Best Picture.",
//       Birth: 1947,
//     },
//     ImageURL:
//       "https://m.media-amazon.com/images/M/MV5BYzdiOTVjZmQtNjAyNy00YjA2LTk5ZTAtNmJkMGQ5N2RmNjUxXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg",
//     Featured: false,
//   },

//   {
//     Title: "The Shining",
//     Released: 1980,
//     Description:
//       "A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific forebodings from both past and future.",
//     Genre: {
//       Name: "Horror",
//       Description:
//         "Horror is a genre of storytelling intended to scare, shock, and thrill its audience. Horror can be interpreted in many different ways, but there is often a central villain, monster, or threat that is often a reflection of the fears being experienced by society at the time.",
//     },

//     Director: {
//       Name: "Stanley Kubrick",
//       Bio: "Stanley Kubrick was an American film director, producer and screenwriter. Widely considered one of the greatest filmmakers of all time, his films—almost all of which are adaptations of novels or short stories—cover a wide range of genres and feature innovative cinematography, dark humor, realistic attention to detail and extensive set designs.",
//       Birth: 1928,
//       Death: 1999,
//     },
//     ImageURL:
//       "https://m.media-amazon.com/images/M/MV5BZWFlYmY2MGEtZjVkYS00YzU4LTg0YjQtYzY1ZGE3NTA5NGQxXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
//     Featured: false,
//   },

//   {
//     Title: "Willy Wonka and the Chocolate Factory",
//     Released: 1971,
//     Description:
//       "The film tells the story of a poor child named Charlie Bucket who, upon finding a Golden Ticket in a chocolate bar, wins the chance to visit Willy Wonka's chocolate factory along with four other children from around the world.",
//     Genre: {
//       Name: "Fantasy",
//       Description:
//         "Fantasy films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds. The genre is considered a form of speculative fiction alongside science fiction films and horror films, although the genres do overlap.",
//     },

//     Director: {
//       Name: "Mel Stuart",
//       Bio: "Mel Stuart was an American film director and producer who often worked with producer David L. Wolper, at whose production firm he worked for 17 years, before going freelance.",
//       Birth: 1928,
//       Death: 2012,
//     },
//     ImageURL:
//       "https://m.media-amazon.com/images/M/MV5BZTllNDU0ZTItYTYxMC00OTI4LThlNDAtZjNiNzdhMWZiYjNmXkEyXkFqcGdeQXVyNzY1NDgwNjQ@._V1_FMjpg_UX1000_.jpg",
//     Featured: true,
//   },

//   {
//     Title: "Indiana Jones and the Last Crusade",
//     Released: 1989,
//     Description:
//       "In the film, set largely in 1938, Indiana searches for his father, a Holy Grail scholar, who has been kidnapped and held hostage by the Nazis while on a journey to find the Holy Grail.",
//     Genre: {
//       Name: "Action",
//       Description:
//         "Action films are built around a core set of characteristics: spectacular physical action; a narrative emphasis on fights, chases, and explosions; and a combination of state-of-the-art special effects and stunt-work.",
//     },

//     Director: {
//       Name: "Steven Spielberg",
//       Bio: "Steven Spielberg is an American filmmaker.A major figure of the New Hollywood era and pioneer of the modern blockbuster, he is the most commercially successful director in history.",
//       Birth: 1946,
//     },
//     ImageURL: "https://m.media-amazon.com/images/I/71agXxNrnOL.jpg",
//     Featured: false,
//   },
// ]);

// GET requests
app.use(express.static("public"));
app.use(morgan("common"));
app.get("/", (req, res) => {
  res.send("Welcome to Cinedex!");
});

//Allow new users to register

app.post("/users", (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + "already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
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
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// app.post("/users", (req, res) => {
//   const newUser = req.body;
//   if (newUser.name) {
//     newUser.id = uuid.v4();
//     users.push(newUser);
//     res.status(201).json(newUser);
//   } else {
//     res.status(400).send("Users must have a name.");
//   }
// });

//Allows users to search for a specific user
app.get("/users/:Username", (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Allow users to update username

app.put("/users/:Username", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});
// app.put("/users/:id", (req, res) => {
//   const { id } = req.params;
//   const updatedUser = req.body;
//   let user = users.find((user) => user.id == id);

//   if (user) {
//     user.name = updatedUser.name;
//     res.status(200).json(user);
//   } else {
//     res.status(400).send("This user does not exist.");
//   }
// });

//Allow users to add movies to their favorite movie list

app.post("/users/:Username/movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $push: { FavoriteMovies: req.params.MovieID },
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});
// app.post("/users/:id/:movieTitle", (req, res) => {
//   const { id, movieTitle } = req.params;
//   let user = users.find((user) => user.id == id);

//   if (user) {
//     user.favoriteMovies.push(movieTitle);
//     res
//       .status(200)
//       .send(
//         `${movieTitle} has been added to user ${id}'s favorite movie list.`
//       );
//   } else {
//     res.status(400).send("This user does not exist.");
//   }
// });

//Allow users to delete movies from their favorite movie list

app.delete("/users/:Username/movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $pull: { FavoriteMovies: req.params.MovieID },
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});
// app.delete("/users/:id/:movieTitle", (req, res) => {
//   const { id, movieTitle } = req.params;

//   let user = users.find((user) => user.id == id);

//   if (user) {
//     user.favoriteMovies.filter((title) => title !== movieTitle);
//     res
//       .status(200)
//       .send(
//         `${movieTitle} has been deleted from user ${id}'s favorite movie list.`
//       );
//   } else {
//     res.status(400).send("This user does not exist.");
//   }
// });

//Allows users to delete their account

app.delete("/users/:Username", (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
// app.delete("/users/:id", (req, res) => {
//   const { id } = req.params;

//   let user = users.find((user) => user.id == id);

//   if (user) {
//     users = users.filter((user) => user.id != id);
//     res.status(200).send(`User ${id} has been deleted.`);
//   } else {
//     res.status(400).send("This user does not exist.");
//   }
// });

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

//Return list of all movies

app.get("/movies", (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// app.get("/movies", (req, res) => {
//   res.status(200).json(movies);
// });

//Return data about a single movie by name

app.get("/movies/:Title", (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
// app.get("/movies/:title", (req, res) => {
//   const { title } = req.params;
//   const movie = movies.find((movie) => movie.Title === title);
//   if (movie) {
//     res.status(200).json(movie);
//   } else {
//     res.status(400).send("This movie does not exist.");
//   }
// });

//Return data about a genre by name

app.get("/movies/genre/:genreName", (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.genreName }, "Genre")
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// app.get("/movies/genre/:genreName", (req, res) => {
//   const { genreName } = req.params;
//   const genre = movies.find((movie) => movie.Genre.Name === genreName);
//   if (genre) {
//     res.status(200).json(genre.Genre);
//   } else {
//     res.status(400).send("This genre does not exist.");
//   }
// });

//Return data about director by name

app.get("/movies/director/:directorName", (req, res) => {
  Movies.find({ "Director.Name": req.params.directorName })
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//
//error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
