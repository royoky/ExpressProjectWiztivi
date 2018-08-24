//const express = require('express'); //old version JS
import express from 'express'
import bodyParser from 'body-parser'
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
    res.setHeader("Access-Control-Allow-Headers", "content-type")
    next()
})

app.use((req, res, next) => {
    setTimeout(next, 1000) // Simplified version of setTimeout, to avoid creating an empty function that calls "next" function
/*     setTimeout(() => {
        next()
    }, 3000) */
})

app.use(express.static('public'))

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.json());

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
        console.log(filteredMovies.length)
        res.json(filteredMovies)
    })
})
// Get movie descritpion
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
/// Get movie poster
app.get('/movie/:',
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

app.post('/MovieForm', (req, res) => {
        //console.log(req.body)
        const newMovie = req.body
        const errorMessages = []
        let data
        let nextID
        let newMovies

        function validateField (field, msg) {
            if (!field || field.trim().length === 0) { errorMessages.push(msg) }
        }

        try {
            data = fs.readFileSync('public/data/moviesTab.json')
            newMovies = JSON.parse(data)
            nextID = newMovies.length
            validateField(newMovie.title, 'Title field is madatory')
            validateField(newMovie.poster, 'Image field is madatory')
            validateField(newMovie.link, 'Link field is madatory')
            validateField(newMovie.synopsis, 'Synopsis field is madatory')
            console.log(errorMessages)
            if (errorMessages.length > 0) return res.status(400).send(errorMessages)    
            /* if (/^ *$/.test(newMovie.title)) {                
                errorMessage[0] = "Title field is mandatory"
                res.status(400).send(errorMessage)
                return
            } */
            newMovie.id = nextID
            newMovies.push(newMovie)
            fs.writeFileSync('public/data/moviesTab.json', JSON.stringify(newMovies))
        } catch (error) {console.log(error)}

        res.send()
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
