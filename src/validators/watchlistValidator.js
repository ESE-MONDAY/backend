import {z} from "zod";

const addToWatchlistSchema = z.object({
    movieId: z.string().uuid("Movie ID must be a valid UUID"),
    status: z.enum(["PLANNED", "WATCHING", "COMPLETED"],
    {
        error: () => ({
            message: "Status must be one of: PLANNED, WATCHING, COMPLETED"
        })
    }
    ).optional(),
    rating: z.coerce.number().int("Rating must be a whole number").min(1).max(10).optional(),
    notes: z.string().max(255, "Notes must be at most 255 characters long").optional() // Optional notes field
});

const updateWatchlistItemSchema = z.object({
    status: z.enum(["PLANNED", "WATCHING", "COMPLETED"]).optional(),
    rating: z.coerce.number().int("Rating must be a whole number").min(1).max(10).optional(),
    notes: z.string().max(255).optional()
});
 
export {
    addToWatchlistSchema,
    updateWatchlistItemSchema       
}