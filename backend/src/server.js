const http = require("http");
const mysql = require("mysql");

// Create connection pool (better than single connection)
const db = mysql.createPool({
    connectionLimit: 10,
    host: "mysql",
    user: "root",
    password: "root",
    database: "login_db",
    port: 3306
});

// Function to test DB connection
function checkDB() {
    db.getConnection((err, connection) => {
        if (err) {
            console.log("⏳ Waiting for MySQL...");
            setTimeout(checkDB, 5000);
        } else {
            console.log("✅ Connected to MySQL");
            connection.release();
        }
    });
}

checkDB();

// Server
const server = http.createServer((req, res) => {

    if (req.method === "POST" && req.url === "/login") {
        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            const data = JSON.parse(body);

            const query = "SELECT * FROM users WHERE username=? AND password=?";

            db.query(query, [data.username, data.password], (err, results) => {
                res.setHeader("Content-Type", "application/json");

                if (err) {
                    console.error(err);
                    res.end(JSON.stringify({ message: "DB Error ❌" }));
                } else if (results.length > 0) {
                    res.end(JSON.stringify({ message: "Login Successful ✅" }));
                } else {
                    res.end(JSON.stringify({ message: "Invalid Credentials ❌" }));
                }
            });
        });

    } else {
        res.statusCode = 404;
        res.end("Not Found");
    }
});

// Start server
server.listen(5000, () => {
    console.log("🚀 Server running on port 5000");
});
