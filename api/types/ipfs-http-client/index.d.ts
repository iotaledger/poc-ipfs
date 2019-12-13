declare module "ipfs-http-client" {
    export namespace IPFS {
        interface IPFSConfig {
            protocol: string;
            host: string;
            port: string;
            "api-path": string;
            headers: { [id: string]: string } | undefined;
        }

        export type FileContent = Object | Blob | string;

        interface IPFSFile {
            path: string;
            hash: string;
            size: number;
            content?: FileContent;
        }

        interface IPFSClient {
            add(buffer: Buffer): Promise<IPFSFile[]>;
        }
    }

    var ipfsClient: (config: IPFS.IPFSConfig) => IPFS.IPFSClient;
    export default ipfsClient;
}