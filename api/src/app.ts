import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import * as db from "./db";

import cors from "cors";

const app = express();

// Middleware
// app.use(
//     cors({
//         origin: process.env.CLIENT_ORIGIN || "http://localhost:80",
//         credentials: true,
//     })
// );
app.use(bodyParser.json());

// Routes
app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the Todo List API!");
});

// Get all todos
app.get("/todos", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await db.query(`SELECT * FROM todo ORDER BY id DESC`);
        if (result && result.rows && result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.status(204).json([]);
        }
    } catch (e) {
        next(e);
    }
});

// Get a single todo
app.get(
    "/todos/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id);
        try {
            const result = await db.query(`SELECT * FROM todo WHERE id = $1`, [
                id,
            ]);
            if (result && result.rows && result.rows.length > 0) {
                res.json(result.rows[0]);
            } else {
                res.status(404).json({ message: "Todo not found" });
            }
        } catch (e) {
            next(e);
        }
    }
);

// Create a todo
app.post("/todos", async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO todo (name) VALUES ($1) RETURNING *`,
            [name]
        );
        if (result && result.rowCount && result.rowCount > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(400).json({ message: "Create failed" });
        }
    } catch (e) {
        next(e);
    }
});

// Update a todo
app.put(
    "/todos/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id);
        const { name } = req.body;
        try {
            const result = await db.query(
                `UPDATE todo SET name = $1 WHERE id = $2`,
                [name, id]
            );

            if (result && result.rowCount && result.rowCount > 0) {
                res.status(200).json({ message: "Updated" });
            } else {
                res.status(400).json({ message: "Delete failed" });
            }
        } catch (e) {
            next(e);
        }
    }
);

// Delete a todo
app.delete(
    "/todos/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id);
        try {
            const result = await db.query(`DELETE FROM todo WHERE id = $1`, [
                id,
            ]);
            if (result && result.rowCount && result.rowCount > 0) {
                res.status(200).json({ message: "Deleted" });
            } else {
                res.status(400).json({ message: "Delete failed" });
            }
        } catch (e) {
            next(e);
        }
    }
);

export default app;
