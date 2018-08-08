//const express = require('express'); //old version JS
import express from 'express'
import fs from 'fs'
const app = express()

//routes
//-------------------------------------------------------------------------
/* const headerMiddleware = (req, res, newt) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081")
    next()
} */

// app.use must be placed at the beginning (before using app.get)
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081")
    next()
})

app.use((req, res, next) => {
    setTimeout(next, 3000) // Simplified version of setTimeout, to avoid creating an empty function that calls "next" function
/*     setTimeout(() => {
        next()
    }, 3000) */
})

app.get('/movies',
    (req, res) => {
        readJSONFile('public/data/moviesTab.json', (err, movies) => {
        if (err) { throw err; }
        //console.log(json);        
        const filteredMovies = movies.map(movie => {
            return {
                title: movie.title,
                poster: movie.poster,
                alt: movie.alt,
                id: movie.id
            }
        })
        res.json(filteredMovies)
    })
})

app.get('/movie/:id',
    (req, res) => {
        //console.log(req.params.id)
        readJSONFile('public/data/moviesTab.json', (err, movies) => {
        if (err) { throw err; }
        //console.log(json);        
        const selectedMovie = movies.find (movie => {
            //console.log(movie)
            return movie.id === req.params.id
        })
        //console.log(selectedMovie)
        res.send(selectedMovie)
    })
})

/**
 * 
 * @param {*} filename 
 * @param {*} callback 
 */
function readJSONFile(filename, callback) {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            callback(err)
            return
        }
        try {
            callback(null, JSON.parse(data));
        } catch (exception) {
            callback(exception)
        }
    })
}

app.listen(5000)
