//Dependencies
const express = require('express'),
      cheerio = require('cheerio'),
      // rp = require('request-promise'),
      logger = require("morgan"),
      // router = express.Router(),
      db = require('../models'),
      axios = require('axios');
  
      var app = express();

      // app.use(logger("dev"));
      // // Parse request body as JSON
      // app.use(express.urlencoded({ extended: true }));
      // app.use(express.json());
      // //Make public a static folder
      // app.use(express.static("public"));

      app.get("/newarticles", function(req, res) {
        // First, we grab the body of the html with axios
        axios.get("http://www.vegnews.com").then(function(response) {
          // Then, we load that into cheerio and save it to $ for a shorthand selector
          var $ = cheerio.load(response.data);
      
          // Now, we grab every h2 within an article tag, and do the following:
          $("a.story-card").each(function(i, element) {
            // Save an empty result object
            var result = {};
      
            // Add the text and href of every link, and save them as properties of the result object
            result.storyUrl = "https://vegnews.com" + $(this).attr('href');
            result.headline = $(this).children('h3').text();
            result.summary = $(this).children('p').text();
            result.imgUrl = "https://vegnews.com" + $(this).children('img').attr('src');
      
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

      module.exports = app;

//route to scrape new articles
// router.get("/newArticles", function(req, res) {


//   //configuring options object for request-promist
//   const options = {
//     uri: 'https://vegnews.com/',
//     transform: function (body) {
//         return cheerio.load(body);
//     }
//   };
//   //calling the database to return all saved articles
//   db.Article
//     .find({})
//     .then((savedArticles) => {
//       //creating an array of saved article headlines
//       savedArticles.map(article => article.headline);

//         //calling request promist with options object
//         rp(options)
//         .then(function ($) {
//           let newArticleArr = [];
//           //iterating over returned articles, and creating a newArticle object from the data
//           $('div.story-cards').each((i, element) => {
//             let newArticle = new db.Article({
//               storyUrl: "https://vegnews.com" + $(element).find('a').attr('href'),
//               headline: $(element).find('h3').text().trim(),
//               summary : $(element).find('p').text().trim(),
//               imgUrl  : "https://vegnews.com" + $(element).find('img').attr('src'),
//             });
//             console.log(newArticle)

          
//                 newArticleArr.push(newArticle);
            

//           });//end of each function

//           //adding all new articles to database
//           db.Article
//             .create(newArticleArr)
//             .then(results => results.json({count: newArticleArr.length}))//returning count of new articles to front end
            
//         })
//         .catch(err => console.log(err)); //end of rp method
//     })
//     .catch(err => console.log(err)); //end of db.Article.find()
// });// end of get request to /scrape

// module.exports = router;