import bodyParser from "body-parser";
import express, { Application } from "express";
import { IConfiguration } from "./models/configuration/IConfiguration";
import { routes } from "./routes";
import { cors, executeRoute } from "./utils/apiHelper";

const configId = process.env.CONFIG_ID || "local";
// tslint:disable-next-line: no-var-requires non-literal-require
const config: IConfiguration = require(`./data/config.${configId}.json`);

const app: Application = express();

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use((req, res, next) => {
    cors(
        req,
        res,
        config.allowedDomains ? config.allowedDomains.join(",") : undefined,
        "GET, POST, OPTIONS, PUT, PATCH, DELETE",
        "Content-Type, Authorization");
    next();
});

for (const route of routes) {
    app[route.method](route.path, async (req, res) => {
        await executeRoute(
            req,
            res,
            config,
            route,
            req.params);
    });
}

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
app.listen(port, () => {
    console.log(`Started API Server on port ${port}`);
    console.log(`Running Config '${configId}'`);
});

app.on("error", error => {
    console.error("Error while initializing service:", error);
});
