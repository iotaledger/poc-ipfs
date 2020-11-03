declare module "ipfs-http-client" {
    export namespace IPFS {
        interface IPFSConfig {
            protocol: string;
            host: string;
            port: string;
            "api-path": string;
            headers: { [id: string]: string } | undefined;
        }

        interface IPSFCID {
            version: number;
            codec: string;
            multihash: Buffer;
            multibaseName: string;
        }

        export type FileContent = Object | Blob | string;

        interface IPFSFile {
            path: string;
            cid: IPSFCID;
            size: number;
        }

        interface IPFSClient {
            add(buffer: Buffer): Promise<IPFSFile>;
        }
    }

    var ipfsClient: (config: IPFS.IPFSConfig) => IPFS.IPFSClient;
    export default ipfsClient;
}
