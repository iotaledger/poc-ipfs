import { IRoute } from "./models/app/IRoute";

export const routes: IRoute[] = [
    {
        path: "/",
        method: "get",
        inline: async () => {
            // tslint:disable-next-line: no-require-imports
            const packageJson = require("../package.json");
            return {
                name: packageJson.name,
                version: packageJson.version
            };
        }
    },
    { path: "/init", method: "get", func: "init" },
    { path: "/ipfs", method: "post", func: "ipfsStore" },
    { path: "/ipfs", method: "get", func: "ipfsRetrieve" }
];
