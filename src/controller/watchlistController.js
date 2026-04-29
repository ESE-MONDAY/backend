import { prisma } from "../config/db.js";

const addToWatchlist = async (req, res) => {
    try {
        const { movieId, status, rating, notes} = req.body;
        

        // 2. Check if the movie exists
        const movie = await prisma.movie.findUnique({ where: { id: movieId } });
        if (!movie) {
            return res.status(404).json({ error: "Movie not found" });
        }

        // 3. Check if already in watchlist
        // Note: This requires a @@unique([userId, movieId]) in your schema
        const existingEntry = await prisma.watchlistItem.findFirst({
            where: {
                userId: req.user.id,
                movieId: movieId
            }
        });

        if (existingEntry) {
            return res.status(400).json({ error: "Movie already in your watchlist" });
        }

        // 4. Create watchlist entry
        const watchlistEntry = await prisma.watchlistItem.create({
            data: {
                userId: req.user.id,
                movieId,
                status: status || "PLANNED",
                rating: rating ? parseInt(rating) : null,
                notes,
                updatedAt: new Date() // Required by your schema
            }
        });

        return res.status(201).json({
            status: "success",
            data: watchlistEntry
        });

    } catch (error) {
        console.error("Watchlist Error:", error);

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

const removeFromWatchlist = async (req, res) => {
    console.log("Remove from watchlist called with params:", req.params);
    try {
        const { id } = req.params;  
        if (!id) {
            return res.status(400).json({ error: "Watchlist item ID is required" });
        }   
            
        const deletedItem = await prisma.watchlistItem.deleteMany({
            where: {
                id: id,
                userId: req.user.id
            }
        }); 
    
        if (deletedItem.count === 0) {
            return res.status(404).json({ error: "Watchlist item not found or you do not have permission to delete it" });
        }


        return res.status(200).json({
            status: "success",
            message: "Item removed from watchlist"
        });
    } catch (error) {
        console.error("Error removing from watchlist:", error);
        return res.status(500).json({ 
            error: "Internal server error", 
            message: error.message 
        });
    }
}


const updateWatchlistItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rating, notes } = req.body;

        if (!id) {
            return res.status(400).json({ error: "Watchlist item ID is required" });
        }

        const updatedItem = await prisma.watchlistItem.updateMany({
            where: {
                id: id,
                userId: req.user.id
            },
            data: {
                status,
                rating: rating ? parseInt(rating) : null,
                notes,
                updatedAt: new Date()
            }
        });

        if (updatedItem.count === 0) {
            return res.status(404).json({ error: "Watchlist item not found or you do not have permission to update it" });
        }       

        return res.status(200).json({
            status: "success",
            message: "Watchlist item updated",
            data: {
                id,
                status,
                rating: rating ? parseInt(rating) : null,
                notes,
            }
        });
    } catch (error) {
        console.error("Error updating watchlist item:", error);
        return res.status(500).json({ 
            error: "Internal server error", 
            message: error.message 
        });
    }

}

const getWatchlist = async (req, res) => {
    try {
        const watchlist = await prisma.watchlistItem.findMany({
            where: { userId: req.user.id },
            include: {
                movie: true
            }
        });
        return res.status(200).json({
            status: "success",
            data: watchlist
        });
    } catch (error) {
        console.error("Error fetching watchlist:", error);
        return res.status(500).json({ 
            error: "Internal server error", 
            message: error.message 
        });
    }
}


export  {
    addToWatchlist, removeFromWatchlist, updateWatchlistItem, getWatchlist
}