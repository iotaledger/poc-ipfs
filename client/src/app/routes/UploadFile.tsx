import classNames from "classnames";
import crypto from "crypto";
import { Button, ButtonContainer, ClipboardHelper, Fieldset, Form, FormActions, FormStatus, Heading, ScrollHelper, Success } from "iota-react-components";
import React, { Component, ReactNode } from "react";
import { SHA3 } from "sha3";
import { ServiceFactory } from "../../factories/serviceFactory";
import { IConfiguration } from "../../models/config/IConfiguration";
import { ApiClient } from "../../services/apiClient";
import { ConfigurationService } from "../../services/configurationService";
import { IpfsService } from "../../services/ipfsService";
import { TangleExplorerService } from "../../services/tangleExplorerService";
import { UploadFileState } from "./UploadFileState";

/**
 * Component which will upload a file to IPFS and attach to tangle.
 */
class UploadFile extends Component<any, UploadFileState> {
    /**
     * The maximum file size we want to accept.
     */
    private static readonly BYTES_PER_MEGABYTE: number = 1048576;

    /**
     * The configuration.
     */
    private readonly _configuration: IConfiguration;

    /**
     * The api client.
     */
    private readonly _apiClient: ApiClient;

    /**
     * The ipfs service.
     */
    private readonly _ipfsService: IpfsService;

    /**
     * The tangle explorer service.
     */
    private readonly _tangleExplorerService: TangleExplorerService;

    /**
     * Create a new instance of UploadFile.
     * @param props The props.
     */
    constructor(props: any) {
        super(props);

        this._configuration = ServiceFactory.get<ConfigurationService<IConfiguration>>("configuration").get();
        this._apiClient = new ApiClient(this._configuration.apiEndpoint);
        this._ipfsService = ServiceFactory.get<IpfsService>("ipfs");
        this._tangleExplorerService = ServiceFactory.get<TangleExplorerService>("tangleExplorer");

        const maxSize = this._configuration.maxBytes ?? UploadFile.BYTES_PER_MEGABYTE / 2;

        const maxSizeString = maxSize >= UploadFile.BYTES_PER_MEGABYTE
                ? `${(maxSize / UploadFile.BYTES_PER_MEGABYTE).toFixed(1)} Mb`
                : `${(maxSize / 1024)} Kb`

        this.state = {
            isBusy: false,
            isValid: false,
            isErrored: false,
            status: "",
            fileName: "",
            fileDescription: "",
            fileSize: undefined,
            fileModified: undefined,
            fileAlgorithm: "sha3",
            fileHash: "",
            fileBuffer: undefined,
            transactionHash: "",
            ipfsHash: "",
            maxSize: maxSizeString
        };
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <React.Fragment>
                {!this.state.transactionHash && (
                    <React.Fragment>
                        <Heading level={1}>Upload File</Heading>
                        <p>Please select the file you want to upload to the Tangle and IPFS.<br />
                            The file must be greater than 0 bytes and less than {this.state.maxSize} in size.<br />
                            This limit is imposed by this demonstration, IPFS has no real limits in this respect.</p>
                        <Form>
                            <Fieldset>
                                <label>File</label>
                                <input
                                    type="text"
                                    placeholder="Please choose a file to upload"
                                    value={this.state.fileName}
                                    readOnly={true}
                                />
                                <Button
                                    disabled={this.state.isBusy}
                                    onClick={() => this.chooseFile()}
                                >
                                    Choose File
                                </Button>
                            </Fieldset>
                            {this.state.fileSize !== undefined &&
                                <Fieldset small={true}>
                                    <label>Size</label>
                                    <span
                                        className={
                                            classNames(
                                                {
                                                    danger:
                                                        this.state.fileSize === 0 ||
                                                        this.state.fileSize > UploadFile.BYTES_PER_MEGABYTE
                                                })
                                        }
                                    >
                                        {this.state.fileSize} bytes
                                        {this.state.fileSize > UploadFile.BYTES_PER_MEGABYTE
                                            ? " - the file is too large for this demonstration" : ""}
                                        {this.state.fileSize === 0
                                            ? " - the file is too small for this demonstration" : ""}
                                    </span>
                                </Fieldset>
                            }
                            {this.state.fileModified &&
                                <Fieldset small={true}>
                                    <label>Modified Date</label>
                                    <span>{this.state.fileModified.toISOString()}</span>
                                </Fieldset>
                            }
                            {this.state.fileHash &&
                                <React.Fragment>
                                    <Fieldset small={true}>
                                        <label>Algorithm</label>
                                        <span>
                                            <Button
                                                size="small"
                                                disabled={this.state.isBusy}
                                                color={this.state.fileAlgorithm === "sha3" ? "primary" : "secondary"}
                                                onClick={() => this.setAlgorithm("sha3")}
                                            >
                                                SHA3
                                            </Button>
                                            <Button
                                                size="small"
                                                disabled={this.state.isBusy}
                                                color={this.state.fileAlgorithm === "sha256" ? "primary" : "secondary"}
                                                onClick={() => this.setAlgorithm("sha256")}
                                            >
                                                SHA256
                                            </Button>
                                        </span>
                                    </Fieldset>
                                    <Fieldset small={true}>
                                        <label>Hash</label>
                                        <span>{this.state.fileHash}</span>
                                    </Fieldset>
                                </React.Fragment>
                            }
                            <Fieldset>
                                <label>Description</label>
                                <input
                                    type="text"
                                    placeholder="Please enter a short description for the file"
                                    value={this.state.fileDescription}
                                    onChange={e => this.setState(
                                        { fileDescription: e.target.value }, () => this.validateData())}
                                    maxLength={100}
                                    readOnly={this.state.isBusy}
                                />
                            </Fieldset>
                            <FormActions>
                                <Button
                                    disabled={!this.state.isValid || this.state.isBusy}
                                    onClick={async () => this.uploadFile()}
                                >
                                    Upload
                                </Button>
                            </FormActions>
                            <FormStatus
                                message={this.state.status}
                                isBusy={this.state.isBusy}
                                isError={this.state.isErrored}
                            />
                        </Form>
                    </React.Fragment>
                )}
                {this.state.transactionHash && (
                    <React.Fragment>
                        <Heading level={1}>File Uploaded</Heading>
                        <Success message="The file has successfully been added to the Tangle and IPFS." />
                        <p>You can view the transaction on the Tangle here.</p>
                        <ButtonContainer>
                            <Button
                                color="secondary"
                                long={true}
                                onClick={() => this._tangleExplorerService.transaction(this.state.transactionHash)}
                            >
                                {this.state.transactionHash}
                            </Button>
                            <Button
                                color="secondary"
                                onClick={() => ClipboardHelper.copy(this.state.transactionHash)}
                            >
                                Copy Tangle Hash
                            </Button>
                        </ButtonContainer>
                        <p>A public gateway for the file is linked below, the file may not be available immediately
                             as it takes time to propogate through the IPFS network.</p>
                        <ButtonContainer>
                            <Button
                                color="secondary"
                                long={true}
                                disableCaseStyle={true}
                                onClick={() => this._ipfsService.exploreFile(this.state.ipfsHash)}
                            >
                                {this.state.ipfsHash}
                            </Button>
                            <Button
                                color="secondary"
                                onClick={() => ClipboardHelper.copy(this.state.ipfsHash)}
                            >
                                Copy IPFS Hash
                            </Button>
                        </ButtonContainer>
                        <br />
                        <Button color="primary" onClick={() => this.resetState()}>Upload Another File</Button>
                    </React.Fragment>
                )}
                <p>To find out more details on how this was implemented, please read the Blueprint on the docs
                site
                <a
                        href="https://docs.iota.org/docs/blueprints/0.1/tangle-data-storage/overview"
                        target="_blank"
                        rel="noopener noreferrer"
                >
                        Tangle Data Storage Blueprint
                </a>
                    or
                view the source code on
                <a
                        href="https://github.com/iotaledger/poc-ipfs"
                        target="_blank"
                        rel="noopener noreferrer"
                >
                        GitHub
                </a>
                .</p>
            </React.Fragment>
        );
    }

    /**
     * Validate the data in the form.
     * @returns True if the data is valid.
     */
    private validateData(): boolean {
        const isValid =
            this.state.fileName.length > 0 &&
            this.state.fileDescription.trim().length > 0 &&
            this.state.fileSize !== undefined &&
            this.state.fileSize > 0 &&
            this.state.fileSize < UploadFile.BYTES_PER_MEGABYTE;
        this.setState({ isValid, status: "" });
        return isValid;
    }

    /**
     * Open a document and get its details.
     */
    private chooseFile(): void {
        const input: HTMLInputElement = document.createElement("input");
        input.type = "file";
        input.accept = "";
        input.onchange = () => {
            if (input.files && input.files.length > 0) {
                const inputFile = input.files[0];
                try {
                    const fileReader = new FileReader();
                    fileReader.onloadend = () => {
                        if (fileReader.result) {
                            const buffer = Buffer.from(fileReader.result as ArrayBuffer);

                            this.setState(
                                {
                                    fileName: inputFile.name,
                                    fileSize: inputFile.size,
                                    fileModified: new Date(inputFile.lastModified),
                                    fileBuffer: buffer
                                },
                                () => {
                                    this.setAlgorithm(this.state.fileAlgorithm || "sha256");
                                    this.validateData();
                                });
                        }
                    };
                    fileReader.readAsArrayBuffer(input.files[0]);
                } catch (err) {
                }
            } else {
            }
        };
        input.click();
    }

    /**
     * Upload the file to the API.
     */
    private async uploadFile(): Promise<void> {
        this.setState(
            {
                isBusy: true,
                status: "Uploading file, please wait...",
                isErrored: false
            },
            async () => {
                const response = await this._apiClient.uploadFile({
                    name: this.state.fileName || "",
                    description: this.state.fileDescription || "",
                    size: this.state.fileSize || 0,
                    modified: (this.state.fileModified || new Date()).toISOString(),
                    algorithm: this.state.fileAlgorithm,
                    hash: this.state.fileHash || "",
                    data: (this.state.fileBuffer || Buffer.from("")).toString("base64")
                });

                if (response.success) {
                    this.setState({
                        isBusy: false,
                        status: "",
                        isErrored: false,
                        transactionHash: response.transactionHash,
                        ipfsHash: response.ipfs
                    });
                } else {
                    this.setState({
                        isBusy: false,
                        status: response.message,
                        isErrored: true
                    });
                }
            });
    }

    /**
     * Reset the state of the component.
     */
    private resetState(): void {
        this.setState(
            {
                isBusy: false,
                isValid: false,
                isErrored: false,
                status: "",
                fileName: "",
                fileDescription: "",
                fileSize: undefined,
                fileModified: undefined,
                fileHash: "",
                fileBuffer: undefined,
                transactionHash: "",
                ipfsHash: ""
            },
            () => {
                this.validateData();
                ScrollHelper.scrollRoot();
            });
    }

    /**
     * Set the hash algorithm
     * @param algo The algorithm
     */
    private setAlgorithm(algo: string): void {
        if (this.state.fileBuffer) {
            let finalHash;

            if (algo === "sha256") {
                const hashAlgo = crypto.createHash(algo);
                hashAlgo.update(this.state.fileBuffer);
                finalHash = hashAlgo.digest("hex");
            } else {
                const hashAlgo = new SHA3(256);
                hashAlgo.update(this.state.fileBuffer);
                finalHash = hashAlgo.digest("hex");
            }

            this.setState({
                fileAlgorithm: algo,
                fileHash: finalHash
            });
        }
    }
}

export default UploadFile;
