import express from "express";
import { addToWatchlist, removeFromWatchlist, updateWatchlistItem, getWatchlist } from "../controller/watchlistController.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { addToWatchlistSchema, updateWatchlistItemSchema } from "../validators/watchlistValidator.js"
const router = express.Router();


router.use(authMiddleware); // Apply authentication middleware to all watchlist routes

router.get("/", getWatchlist);


router.post("/", validateRequest(addToWatchlistSchema), addToWatchlist);
router.delete("/:id", removeFromWatchlist)
router.put("/:id", validateRequest(updateWatchlistItemSchema), updateWatchlistItem)


export default router;