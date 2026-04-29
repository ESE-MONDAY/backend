import express from "express";
import { addToWatchlist, removeFromWatchlist, updateWatchlistItem, getWatchlist } from "../controller/watchlistController.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { addToWatchlistSchema, updateWatchlistItemSchema } from "../validators/watchlistValidator.js"

/**
 * @swagger
 * /api/v1/watchlist:
 *   get:
 *     summary: Get user's watchlist
 *     description: Retrieve the authenticated user's watchlist items
 *     tags:
 *       - Watchlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Watchlist retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WatchlistItem'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *   post:
 *     summary: Add movie to watchlist
 *     description: Add a movie to the user's watchlist
 *     tags:
 *       - Watchlist
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieId
 *               - status
 *             properties:
 *               movieId:
 *                 type: string
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *               status:
 *                 type: string
 *                 enum: [watching, completed, dropped]
 *                 example: watching
 *     responses:
 *       201:
 *         description: Movie added to watchlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WatchlistItem'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/watchlist/{id}:
 *   put:
 *     summary: Update watchlist item
 *     description: Update the status or rating of a watchlist item
 *     tags:
 *       - Watchlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Watchlist item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [watching, completed, dropped]
 *                 example: completed
 *               rating:
 *                 type: number
 *                 example: 8.5
 *     responses:
 *       200:
 *         description: Watchlist item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WatchlistItem'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Watchlist item not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Remove from watchlist
 *     description: Remove a movie from the user's watchlist
 *     tags:
 *       - Watchlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Watchlist item ID
 *     responses:
 *       200:
 *         description: Item removed from watchlist successfully
 *       404:
 *         description: Watchlist item not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

const router = express.Router();

router.use(authMiddleware); // Apply authentication middleware to all watchlist routes

router.get("/", getWatchlist);
router.post("/", validateRequest(addToWatchlistSchema), addToWatchlist);
router.delete("/:id", removeFromWatchlist)
router.put("/:id", validateRequest(updateWatchlistItemSchema), updateWatchlistItem)


export default router;