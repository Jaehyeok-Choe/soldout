const express = require("express");
const app = express();
const session = require("express-session");
const fs = require("fs");

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

let sql = require("./sql.js");

fs.watchFile(__dirname + "/sql.js", (curr, prev) => {
    console.log("sql 변경시 재시작 없이 반영되도록 함");
    delete require.cache[require.resolve("./sql.js")];
    sql = require("./sql.js");
});

const db = {
    database: "test",
    connectionLimit: 10,
    host: "192.168.178.165",
    user: "root",
    password: "mariadb",
};

const dbPool = require("mysql").createPool(db);

app.post("/api/login", async (request, res) => {});

app.post("/api/logout", async (request, res) => {});

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
