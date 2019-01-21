# Deployment

## Configuration

You should copy `./public/data/config.template.json` to `./public/data/config.json` and modify it to point the `apiEndpoint` to wherever you have deployed the `api` package.

```js
{
    "apiEndpoint": "ENDPOINT",                              /* The url of the api endpoint e.g. https://api.my-domain.com */
    "ipfsGateway": "https://cloudflare-ipfs.com/ipfs/:hash" /* Url of an IPFS gateway for viewing files */
}
```

## Build

```shell
npm run build
```

## Deploy

The app is configured to use zeit/now for hosting, you can configure `./now.json` to suit your own setup.

After modifying the configuration files you can deploy using the folllowing commands:

```shell
now
```
