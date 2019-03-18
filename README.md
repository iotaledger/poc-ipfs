# IOTA IPFS

This package is an implementation of the Tangle and Data Storage Blueprint [https://docs.iota.org/docs/blueprints/0.1/tangle-data-storage/overview](https://docs.iota.org/docs/blueprints/0.1/tangle-data-storage/overview)


The IOTA IPFS Demonstration is composed of 2 packages `api` and `client`.

## API

The API facilitates all the services required by `client` web UI. It is a set of services running on NodeJS connecting to the Tangle and IPFS.

See [./api/README.md](./api/README.md) for more details.

## Client

The client package provides a React Web UI to provide facilities to upload and authenticate files using IOTA and IPFS.

See [./client/README.md](./client/README.md) for more details.

# Deployed

A demonstration version of the application is currently deployed at the following urls

* client - <https://ipfs.iota.org>
* api - <https://ipfs-api.iota.org>
