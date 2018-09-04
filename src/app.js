//const express = require('express'); //old version JS
import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'
import config from 'config'
import socketio from 'socket.io'
import { Movie } from './db/movie-model'

// initialisation
//-----------------------------------------------------------------------
const app = express()
const io = socketio(5010)

//routes
//-------------------------------------------------------------------------


// app.use must be placed at the beginning (before using app.get)
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081")
    res.setHeader("Access-Control-Allow-Headers", "content-type")
    res.setHeader("Access-Control-Allow-Methods", "DELETE")
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
    async (req, res) => {
/*         readJSONFile(config.get('jsonFile'), (err, movies) => {
        if (err) { throw err; }
        //console.log(json);     
        const filteredMovies = movies.map(movie => {
            return {
                title: movie.title,
                poster: movie.poster,
                alt: movie.alt,
                id: movie.id
            }
        }) */
        const filteredMovies = await Movie.find({}).select('-synopsis')
        res.json(filteredMovies)
    // })
})
// Get movie descritpion
app.get('/movie/:id',
    async (req, res) => {
        // readJSONFile(config.get('jsonFile'), (err, movies) => {
        // if (err) { throw err; }       
        // const selectedMovie = movies.find (movie => {
        //     return movie.id === req.params.id
        // })
        const selectedMovie = await Movie.findById(parseInt(req.params.id))
        if (!selectedMovie) {return res.status(404).send('Movie not found')}
        res.send(selectedMovie)
    // })
})

app.post('/MovieForm/:id?', async (req, res) => {
    const newMovie = req.body
    const errorMessages = []

    function validateField (field, msg) {
        if (!field || field.trim().length === 0) { errorMessages.push(msg) }
    }

    let saveMovie
    try {
        validateField(newMovie.title, 'Title field is mandatory')
        validateField(newMovie.poster, 'Image field is mandatory')
        validateField(newMovie.link, 'Link field is mandatory')
        validateField(newMovie.synopsis, 'Synopsis field is mandatory')
        if (errorMessages.length > 0) return res.status(400).send(errorMessages)

        if(!req.params.id){
            saveMovie = new Movie(newMovie)
            io.emit('insert-movie', saveMovie)
        } else {
/*             const ind = newMovies.findIndex (movie => {
                return movie.id === req.params.id */
            // })
            saveMovie = await Movie.findById(parseInt(req.params.id))
            Object.assign(saveMovie, newMovie)
            io.emit('update-movie', saveMovie)
        }
        await saveMovie.save()
    } catch (error) {console.log(error)}

    res.send(saveMovie)
})


// app.post('/MovieForm/:id?', (req, res) => {
//     const newMovie = req.body
//     const errorMessages = []
//     let data = fs.readFileSync(config.get('jsonFile'))
//     let newMovies = JSON.parse(data)

//     function validateField (field, msg) {
//         if (!field || field.trim().length === 0) { errorMessages.push(msg) }
//     }

//     try {
//         validateField(newMovie.title, 'Title field is mandatory')
//         validateField(newMovie.poster, 'Image field is mandatory')
//         validateField(newMovie.link, 'Link field is mandatory')
//         validateField(newMovie.synopsis, 'Synopsis field is mandatory')
//         if (errorMessages.length > 0) return res.status(400).send(errorMessages)    

//         if(!req.params.id){
//             newMovie.id = Date.now().toString
//             newMovies.push(newMovie)
//             io.emit('insert-movie', newMovie)
//         } else {
// /*             const ind = newMovies.findIndex (movie => {
//                 return movie.id === req.params.id */
//             // })
//                 const originalMovie = await Movie.findById(parseInt(newMovie.id))
//             if (ind === -1) return res.status(404).send(`No existing movie with the id ${req.params.id}`)
//             newMovies.splice(ind, 1, newMovie)
//             io.emit('update-movie', newMovie)
//         }
//         fs.writeFileSync(config.get('jsonFile'), JSON.stringify(newMovies))
//     } catch (error) {console.log(error)}

//     res.send(newMovie)
// })

// Delete a movie
//--------------------------------------------------------------------------------------
/* app.delete('/movie/:id',
    (req, res) => {
        let data = fs.readFileSync(config.get('jsonFile'))
        let movies = JSON.parse(data)
        try {
            const ind = movies.findIndex(movie => {
                return movie.id === req.params.id
            })
            //const ind = movies.indexOf(selectedMovie)
            io.emit('delete-movie', movies[ind])
            movies.splice(ind, 1)
            fs.writeFileSync(config.get('jsonFile'), JSON.stringify(movies))
        } catch (error) { console.log(error) }

        res.send(movies)
    }) */

app.delete('/movie/:id',
    async (req, res) => {
            const deletedMovie = await Movie.deleteOne({ _id: parseInt(req.params.id) })
            io.emit('delete-movie', deletedMovie)
            res.status(203).end()
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