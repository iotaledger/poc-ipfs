# Deployment

## Configuration

To configure the `api` you should copy `./src/data/config.template.json` to `./src/data/config.local.json` and modify the content.

```js
{
    "node": {
        "provider": "https://MYNODE/",               /* A node to perform Tangle operations */
        "depth": 3,                                  /* Depth to use for attaches */
        "mwm": 9                                     /* MWM to use for attaches */
    },
    "ipfs": {                                        /* IPFS Node with storage support */
        "provider": "MYIPFSNODE_PROVIDER",           /* e.g. https://ipfs.mydomain.com:443/api/v0/ */
        "token": "MYIPFSNODE_TOKEN"                  /* Optional token passed in Authorization header */
    },
    "dynamoDbConnection": {
        "region": "DB-AWS-REGION",                      /* AWS Region e.g. eu-central-1 */
        "accessKeyId": "DB-AWS-ACCESS-KEY-ID",          /* AWS Access Key e.g. AKIAI57SG4YC2ZUCSABC */
        "secretAccessKey": "DB-AWS-SECRET-ACCESS-KEY",  /* AWS Secret e.g. MUo72/UQWgL97QArGt9HVUA */
        "dbTablePrefix": "DB-TABLE-PREFIX"              /* Prefix for database table names e.g. certification-dev- */
    },
    "allowedDomains": [                              /* A list of domains for the cors allow-origin */
        "www.mydomain.com"                           /* Include http://localhost:3000 for local testing */
    ]
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