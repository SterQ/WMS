if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//Imported Libreries
const express = require("express");
const app = express();
const bcrypt = require("bcrypt"); //Importing bcrypt package
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const db = require("./mongodb");
const initializePassport = require("./passport-config");
const User = require("./userModel");
const Product = require("./productModel");
const router = express.Router();

// Public folder
app.use(express.static("public"));

//app set
app.set("view engine", "ejs");

//app use
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, //odświeżanie sesji jeśli nic się nie zmienia
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

//Logowanie użytkownika
app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

//Rejestracj użytkownika
app.post("/register", checkNotAuthenticated, async (req, res) => {
  const { fname, lname, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.render("register", {
        message: "Podany email jest już zajęty.",
        email: email,
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        fname: fname,
        lname: lname,
        email: email,
        password: hashedPassword,
      });
      await newUser.save();
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.render("register", {
      message: "Wystąpił błąd podczas rejestracji użytkownika.",
      email: email,
    });
  }
});

app.post("/products", async (req, res) => {
  const { nazwa, rodzaj, dzial, ilosc, cena } = req.body;

  try {
    const newProduct = new Product({
      nazwa: nazwa,
      rodzaj: rodzaj,
      dzial: dzial,
      ilosc: ilosc,
      cena: cena,
    });

    await newProduct.save();

    res.redirect("/allproducts");
  } catch (error) {
    console.error(error);
    res.render("error", { error: "Failed to add product" });
  }
});

// Routes
app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.ejs", { fname: req.user.fname, lname: req.user.lname });
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.get("/allproducts", checkAuthenticated, async (req, res) => {
  try {
    const products = await Product.find();
    res.render("allproducts.ejs", {
      products: products,
      fname: req.user.fname,
      lname: req.user.lname,
    });
  } catch (error) {
    console.error(error);
    res.render("error.ejs");
  }
});

app.get("/products", checkAuthenticated, async (req, res) => {
  try {
    const products = await Product.find();
    res.render("addProduct.ejs", {
      products: products,
      fname: req.user.fname,
      lname: req.user.lname,
    });
  } catch (error) {
    console.error(error);
    res.render("error.ejs");
  }
});

app.get("/deleteproducts", checkAuthenticated, async (req, res) => {
  try {
    const products = await Product.find();
    res.render("deleteProducts.ejs", {
      products: products,
      fname: req.user.fname,
      lname: req.user.lname,
    });
  } catch (error) {
    console.error(error);
    res.render("error.ejs");
  }
});
// End Routes

// Endpoint obsługujący usuwanie produktów
router.post("/deleteproducts", async (req, res) => {
  try {
    // Pobierz tablicę zaznaczonych produktów z ciała żądania
    const { products } = req.body;

    // Usuń produkty z bazy danych na podstawie ich identyfikatorów
    await Product.deleteMany({ _id: { $in: products } });

    // Zwróć odpowiedź 200 OK
    res.sendStatus(200);
  } catch (error) {
    console.error("Błąd podczas usuwania produktów:", error);
    // Zwróć odpowiedź 500 Internal Server Error w przypadku błędu
    res.sendStatus(500);
  }
});

// Dodaj router do aplikacji
app.use("/", router);

app.delete("/logout", (req, res) => {
  req.logout(req.user, (err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

app.listen(3000, () => {
  console.log("Serwer nasłuchuje na porcie 3000");
});
