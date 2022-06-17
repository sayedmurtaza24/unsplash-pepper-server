const express = require('express');
require('dotenv').config()
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();

app.use(express.json());

function getData(searchTerm, callback) {
   fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchTerm}&client_id=${process.env.ACCESS_KEY}`)
      .then(response => response.json())
      .then(data => callback(
         data.results ? data
            .results
            .map(res => ({
               description: res.description,
               url: res.urls.regular,
            })) : [],
      ));
}

app.get('/api/get-unsplash-photo', (req, res) => {
   const searchTerm = req.query.searchTerm;
   if (searchTerm) {
      getData(searchTerm, (result) => res.send(result));
   } else {
      res.send({ message: 'input a search term!' });
   }
})

app.listen(process.env.PORT || 3030, () => console.log('server is running on http://localhost:3030/'));