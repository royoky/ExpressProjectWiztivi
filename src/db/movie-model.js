import mongoose, { Schema } from 'mongoose'

const MovieSchema = new Schema({
    _id: { type: Number, default: Date.now, required: true },
    title: { type: String, required: true },
    poster: { type: String, required: true },
    alt: { type: String, required: true },
    link: { type: String, required: true },
    synopsis: { type: String, required: true }
})

export const Movie = mongoose.model('Movie', MovieSchema)
