# Deployment

## Configuration

To configure the `api` you should copy `./src/data/config.template.json` to `./src/data/config.json` and modify the content.

```js
{
    "provider": "https://MYNODE/",                   /* A node to perform Tangle operations */
    "ipfs": {                                        /* IPFS Node with storage support */
        "protocol": "MYIPFSNODE_PROTOCOL",
        "host": "MYIPFSNODE_HOST",
        "port": "MYIPFSNODE_PORT"
    },
    "seed": "TANGLE_SEED"                           /* seed used for address generation */
}
```

## Build

```shell
npm run build
```

## Deploy

The `api` package is setup to be deployed to zeit/now, you should modify the config in `./now.json` to suit your own requirements and then execute the following.

```shell
now
```