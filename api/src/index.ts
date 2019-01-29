import bodyParser from "body-parser";
import express from "express";
import { IConfiguration } from "./models/IConfiguration";
import { ipfsRetrieve } from "./routes/ipfsRetrieve";
import { ipfsStore } from "./routes/ipfsStore";

// tslint:disable:no-var-requires no-require-imports
const packageJson = require("../package.json");
const configId = process.env.CONFIG_ID || "dev";
// tslint:disable-next-line:non-literal-require
const config: IConfiguration = require(`./data/config.${configId}.json`);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const port = process.env.PORT || 4000;
const app = express();

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", `*`);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "content-type");

    next();
});

app.get("/", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({ version: packageJson.version }));
    res.end();
});

app.post("/ipfs", async (req, res) => {
    const response = await ipfsStore(config, req.body);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(response));
    res.end();
});

app.get("/ipfs", async (req, res) => {
    const response = await ipfsRetrieve(config, req.query);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(response));
    res.end();
});

app.listen(port, async err => {
    if (err) {
        throw err;
    }

    console.log(`Started API Server on port ${port} v${packageJson.version}`);
    console.log(`Tangle Provider ${config.provider}`);
});
