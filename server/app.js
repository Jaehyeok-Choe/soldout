const express = require("express");
const app = express();
const session = require("express-session");

app.use(
    session({
        secret: "secret code",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true,
            maxAge: 1000 * 60 * 60,
        },
    })
);

const server = app.listen(3000, () => {
    console.log("Server started. Port 3000.");
});

const db = {
    database: "test",
    connectionLimit: 10,
    host: "192.168.0.3",
    user: "root",
    password: "mariadb",
};

const dbPool = require("mysql").createPool(db);

app.post("/api/login", async (request, res) => {});

app.post("/api/logout", async (request, res) => {});

const sql = require("./sql.js");

app.post("/api/:alias", async (request, res) => {
    try {
        res.send(await req.db(request.params.alias));
    } catch (err) {
        res.status(500).send({
            error: err,
        });
    }
});

const req = {
    async db(alias, param = [], where = "") {
        return new Promise((resolve, reject) =>
            dbPool.query(sql[alias].query + where, param, (error, rows) => {
                if (error) {
                    if (error.code != "ER_DUP_ENTRY") console.log(error);
                    resolve({
                        error,
                    });
                } else resolve(rows);
            })
        );
    },
};
