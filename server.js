var express = require('express');
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var logger = require('morgan');
var path = require('path');
var cheerio = require('cheerio'); 

var PORT = 3000;

var app = express();

var db = require("./models");


var config = require("./config/database");
mongoose.Promise = Promise;
console.log(Promise);
mongoose.connect(config.database).then(result => {
    console.log(`Connected to database '${result.connections[0].name}' on ${result.connections[0].host}:${result.connections[0].port}`);
}).catch(err => console.log('There was an error with your connection:', err));

app.use(logger('dev'));

//setting up body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//setting up handlebars middleware
// app.engine('handlebars', exphbs({defaultLayout: 'main'}));
// app.set('view engine', 'handlebars');

// //setting up the static directory
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/articles',express.static(path.join(__dirname, 'public')));

//var index = require("./routes/index");

app.get("/", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("http://reductress.com/news/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("article h1").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.Headline = $(this)
          .children("a")
          .text();
        result.URL = $(this)
          .children("a")
          .attr("href");
          result.imgURL = $(this)
          .children("a")
          .attr("src");
          result.Summary = $(this)
          .children("a")
          .attr("p");
  
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

    


        app.listen(PORT, function() {
            console.log("App running on port " + PORT + "!");
          });
          

