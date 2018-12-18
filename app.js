const express = require('express');
require('./models/Notes');
const mongoose = require('mongoose');
const paginate = require('express-paginate');
const Notes = mongoose.model('notes');
const exphbs = require('express-handlebars');

// Map global promises
mongoose.Promise = global.Promise;
// Mongoose Connect
mongoose.connect('{{DB connecting string}}', {

})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const app = express();

app.engine('handlebars', exphbs({

    defaultLayout: 'main'
  }));
  app.set('view engine', 'handlebars');

const port = 8000;

app.use(paginate.middleware(10, 50));

app.get('/', async (req, res, next) => {

  // This example assumes you've previously defined `Users`
  // as `const Users = db.model('Users')` if you are using `mongoose`
  // and that you are using Node v7.6.0+ which has async/await support
  try {

    const [ results, itemCount ] = await Promise.all([
      Notes.find({}).limit(req.query.limit).skip(req.skip).lean().exec(),
    Notes.count({})
    ]);

    const pageCount = Math.ceil(itemCount / req.query.limit);

   
      res.render('layouts/main', {
        users: results,
        pageCount,
        itemCount,
        pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
      });
      console.log(results);
    

  } catch (err) {
    next(err);
  }

});

app.listen(port,() => {
    console.log(`server started on port ${port}`);
})