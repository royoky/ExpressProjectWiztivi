//const express = require('express'); //old version JS
import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'
import config from 'config'
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
    setTimeout(next, config.get('timeout')) // Simplified version of setTimeout, to avoid creating an empty function that calls "next" function
/*     setTimeout(() => {
        next()
    }, 3000) */
})
2500
app.use(express.static('public'))

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.json());

app.get('/movies',
    (req, res) => {
        readJSONFile(config.get('jsonFile'), (err, movies) => {
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
// Get movie descritpion
app.get('/movie/:id',
    (req, res) => {
        //console.log(req.params.id)
        readJSONFile(config.get('jsonFile'), (err, movies) => {
        if (err) { throw err; }
        //console.log(json);        
        const selectedMovie = movies.find (movie => {
            //console.log(movie)
            return movie.id === req.params.id
        })
        if (!selectedMovie) {return res.status(404).send('Movie not found')}
        //console.log(selectedMovie)
        res.send(selectedMovie)
    })
})
/// Get movie poster
app.get('/movie/:',
    (req, res) => {
        //console.log(req.params.id)
        readJSONFile(config.get('jsonFile'), (err, movies) => {
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
        const newMovie = req.body
        const errorMessages = []
        let data
        let newMovies
        data = fs.readFileSync(config.get('jsonFile'))
        newMovies = JSON.parse(data)

        function validateField (field, msg) {
            if (!field || field.trim().length === 0) { errorMessages.push(msg) }
        }
        
        try {
            validateField(newMovie.title, 'Title field is mandatory')
            validateField(newMovie.poster, 'Image field is mandatory')
            validateField(newMovie.link, 'Link field is mandatory')
            validateField(newMovie.synopsis, 'Synopsis field is mandatory')
            if (errorMessages.length > 0) return res.status(400).send(errorMessages)    
            /* if (/^ *$/.test(newMovie.title)) {                
                errorMessage[0] = "Title field is mandatory"
                res.status(400).send(errorMessage)
                return
            } */
            newMovie.id = Date.now().toString
            newMovies.push(newMovie)
            fs.writeFileSync(config.get('jsonFile'), JSON.stringify(newMovies))
        } catch (error) {console.log(error)}

        res.send(newMovie)
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

// export
export default app