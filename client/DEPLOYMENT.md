# Deployment

## Configuration

You should copy `./public/data/config.template.json` to `./public/data/config.dev.json` and modify it to point the `apiEndpoint` to wherever you have deployed the `api` package.

```js
{
    "apiEndpoint": "ENDPOINT",                   /* The url of the api endpoint e.g. https://api.my-domain.com */
    "ipfsGateway": "https://ipfs.io/ipfs/:hash", /* Url of an IPFS gateway for viewing files */
    "tangleExplorer": {
        "transactions": "https://thetangle.org/transaction/:transactionHash",
        "bundles": "https://thetangle.org/bundle/:bundleHash"
    }
}
```

## Build

```shell
npm run build
```

## Deploy

The app is configured to use zeit/now for hosting, you can configure `./now.json` to suit your own setup.

If you want to use a different name for the config file you can specify an environment variable of CONFIG_ID, e.g. set CONFIG_ID to `dev` will load `config.dev.json` instead.

After modifying the configuration files you can deploy using the folllowing commands:

```shell
now
```
