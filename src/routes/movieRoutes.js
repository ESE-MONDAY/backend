import express from "express";
import {authMiddleware} from "../middleware/auth-middleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { MovieSchema } from "../validators/movieValidator.js";
import { addMovie, deleteMovie, getMovie, getMovies } from "../controller/movieController.js";

/**
 * @swagger
 * /api/v1/movies:
 *   get:
 *     summary: Get all movies
 *     description: Retrieve a list of all movies in the database
 *     tags:
 *       - Movies
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of movies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *   post:
 *     summary: Add a new movie
 *     description: Create a new movie entry in the database
 *     tags:
 *       - Movies
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - releaseYear
 *             properties:
 *               title:
 *                 type: string
 *                 example: The Shawshank Redemption
 *               overview:
 *                 type: string
 *                 example: Two imprisoned men bond over a number of years...
 *               releaseYear:
 *                 type: integer
 *                 example: 1994
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [Drama, Crime]
 *               runtime:
 *                 type: integer
 *                 example: 142
 *               posterUrl:
 *                 type: string
 *                 example: https://image.tmdb.org/t/p/w342/...
 *     responses:
 *       201:
 *         description: Movie created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/movies/{id}:
 *   get:
 *     summary: Get a specific movie
 *     description: Retrieve details of a movie by ID
 *     tags:
 *       - Movies
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a movie
 *     description: Remove a movie from the database
 *     tags:
 *       - Movies
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       404:
 *         description: Movie not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

const router = express.Router();

router.use(authMiddleware);
router.get("/", getMovies);
router.post("/", validateRequest(MovieSchema), addMovie);
router.get("/:id", getMovie);
router.delete("/:id", deleteMovie);



export default router;