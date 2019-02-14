# Deployment

## Configuration

To configure the `api` you should copy `./src/data/config.template.json` to `./src/data/config.dev.json` and modify the content.

```js
{
    "provider": "https://MYNODE/",                   /* A node to perform Tangle operations */
    "depth": 3,                                      /* Depth to use for attaches */
    "mwm": 9,                                        /* MWM to use for attaches */
    "ipfs": {                                        /* IPFS Node with storage support */
        "protocol": "MYIPFSNODE_PROTOCOL",           /* e.g. https:// */
        "host": "MYIPFSNODE_HOST",                   /* e.g. ipfs.mydomain.com */
        "port": "MYIPFSNODE_PORT",                   /* e.g. 443 */
        "apiPath": "MYIPFSNODE_APIPATH",             /* e.g. /api/v0/ */
        "token": "MYIPFSNODE_TOKEN"                  /* Optional token passed in Authorization header */
    },
    "seed": "TANGLE_SEED"                            /* seed used for address generation */
}
```

## Build

```shell
npm run build
```

## Deploy

The `api` package is setup to be deployed to zeit/now, you should modify the config in `./now.json` to suit your own requirements and then execute the following.

If you want to use a different name for the config file you can specify an environment variable of CONFIG_ID, e.g. set CONFIG_ID to `dev` will load `config.dev.json` instead.

```shell
now
```