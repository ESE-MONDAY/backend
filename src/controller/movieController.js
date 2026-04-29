import { parse } from "dotenv";
import { prisma } from "../config/db.js";


const addMovie = async (req, res) => {
    try {
        const { title, overview, releaseYear, genres, runtime,posterUrl} = req.body;
        

        // 2. Check if the movie exists
        const movie = await prisma.movie.findUnique({ where: { title: title } });

        if (movie) {
            return res.status(200).json({ error: "Movie already exists" });
        }

        const movieEntry = await prisma.movie.create({
            data: {
                createdBy: req.user.id,
                title,
                releaseYear: parseInt(releaseYear), // Ensure releaseYear is stored as an integer
                overview,
                genres,
                runtime: parseInt(runtime), // Ensure runtime is stored as an integer
                posterUrl
              
            }
        });

        return res.status(201).json({
            status: "success",
            data: movieEntry
        });

    } catch (error) {
        console.error("Movie Error:", error);

        // Handle specific Prisma errors if needed
        if (error.code === 'P2002') {
            return res.status(400).json({ error: "Constraint violation: This item is already tracked." });
        }

        return res.status(500).json({ 
            error: "Internal server error", 
            message: error.message 
        });
    }
};


const deleteMovie = async (req, res) => {
    console.log("Remove from movielist called with params:", req.params);   
    try {
        const { id } = req.params;  
        if (!id) {
            return res.status(400).json({ error: "Movie ID is required" });
        }   
        
        const deletedEntry = await prisma.movie.deleteMany({
            where: {
                createdBy: req.user.id,
                id: id
            }
        });         
        if (deletedEntry.count === 0) {
            return res.status(404).json({ error: "Movie not found in database" });
        }   
        return res.status(200).json({
            status: "success",
            message: "Movie removed from MovieList",
            data: deletedEntry
         });
    } catch (error) {
        console.error("Movie Deletion Error:", error);
        return res.status(500).json({       
            error: "Internal server error", 
            message: error.message 
        });
    }   
};

const getMovie = async (req, res) => {
    try{
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Movie ID is required" });
        }
        const movie = await prisma.movie.findUnique({ where: { id: id } });
        if (!movie) {
            return res.status(404).json({ error: "Movie not found" });
        }
        return res.status(200).json({ data: movie });
    } catch (error) {
        console.error("Movie Retrieval Error:", error);
        return res.status(500).json({       
            error: "Internal server error", 
            message: error.message 
        });

    }
}

const getMovies = async (req, res) => {
    try {
        const movies = await prisma.movie.findMany();
        return res.status(200).json({ data: movies });
    } catch (error) {
        console.error("Movie Retrieval Error:", error);
        return res.status(500).json({       
            error: "Internal server error", 
            message: error.message 
        });
    }
}

export {
    addMovie,
    deleteMovie, 
    getMovie,
    getMovies
}