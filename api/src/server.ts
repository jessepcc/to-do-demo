import app from "./app";
import { pool } from "./db";
import "dotenv/config";

const port = process.env.PORT || 3000;

// Start server, test database connection
app.listen(port, () => {
    console.log(`Server running at ${port}`);
    // check if db is connected
    pool.connect()
        .then((obj) => {
            console.log("connected to db");
            obj.release(); // success, release connection;
        })
        .catch((error) => {
            console.log("ERROR:", error.message || error);
        });
});
