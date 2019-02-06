import classNames from "classnames";
import crypto from "crypto";
import { Alert, Button, Fieldset, Form, FormButtons, Heading, Spinner, Success } from "iota-react-components";
import React, { Component, ReactNode } from "react";
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
    private static readonly MAX_FILE_SIZE: number = 10240;

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

        this.state = {
            isBusy: false,
            isValid: false,
            status: "",
            statusColor: "success",
            fileName: "",
            fileDescription: "",
            fileSize: undefined,
            fileModified: undefined,
            fileSha256: "",
            fileBuffer: undefined,
            transactionHash: "",
            ipfsHash: ""
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
                        <p>Please select the file you want to upload to the Tangle and IPFS.</p>
                        <p>The file must be greater than 0 bytes and less than {UploadFile.MAX_FILE_SIZE} bytes in size.</p>
                        <Form>
                            <Fieldset>
                                <label>File</label>
                                <input
                                    type="text"
                                    placeholder="Please choose a file to upload"
                                    value={this.state.fileName}
                                    readOnly={true}
                                />
                                <Button disabled={this.state.isBusy} onClick={() => this.chooseFile()}>Choose File</Button>
                            </Fieldset>
                            {this.state.fileSize !== undefined &&
                                <Fieldset>
                                    <label>Size</label>
                                    <span className={classNames({ danger: this.state.fileSize === 0 || this.state.fileSize > UploadFile.MAX_FILE_SIZE })}>
                                        {this.state.fileSize} bytes
                                        {this.state.fileSize > UploadFile.MAX_FILE_SIZE ? " - the file is too large for this demonstration" : ""}
                                        {this.state.fileSize === 0 ? " - the file is too small for this demonstration" : ""}
                                    </span>
                                </Fieldset>
                            }
                            {this.state.fileModified &&
                                <Fieldset>
                                    <label>Modified Date</label>
                                    <span>{this.state.fileModified.toISOString()}</span>
                                </Fieldset>
                            }
                            {this.state.fileSha256 &&
                                <Fieldset>
                                    <label>Sha256</label>
                                    <span>{this.state.fileSha256}</span>
                                </Fieldset>
                            }
                            <Fieldset>
                                <label>Description</label>
                                <input
                                    type="text"
                                    placeholder="Please enter a short description for the file"
                                    value={this.state.fileDescription}
                                    onChange={e => this.setState({ fileDescription: e.target.value }, () => this.validateData())}
                                    maxLength={100}
                                    readOnly={this.state.isBusy}
                                />
                            </Fieldset>
                            <FormButtons>
                                <Button disabled={!this.state.isValid || this.state.isBusy} onClick={async () => this.uploadFile()}>Upload</Button>
                            </FormButtons>
                            {this.state.isBusy && (
                                <React.Fragment>
                                    <FormButtons>
                                        <Spinner />
                                    </FormButtons>
                                    <FormButtons>
                                        Uploading file, please wait...
                                    </FormButtons>
                                </React.Fragment>
                            )}
                            {this.state.status && (
                                <React.Fragment>
                                    <FormButtons>
                                        <Alert status={this.state.status} color={this.state.statusColor} />
                                    </FormButtons>
                                </React.Fragment>
                            )}
                        </Form>
                    </React.Fragment>
                )}
                {this.state.transactionHash && (
                    <React.Fragment>
                        <Heading level={1}>File Uploaded</Heading>
                        <Success />
                        <p>The file has successfully been added to the Tangle and IPFS.</p>
                        <p>You can view the transaction on the Tangle here.</p>
                        <Button color="primary" long={true} onClick={() => this._tangleExplorerService.transaction(this.state.transactionHash)}>{this.state.transactionHash}</Button>
                        <p>A public gateway for the file is linked below, the file may not be available immediately as it takes time to propogate through the IPFS network.</p>
                        <Button color="primary" long={true} disableCaseStyle={true} onClick={() => this._ipfsService.exploreFile(this.state.ipfsHash)}>{this.state.ipfsHash}</Button>
                        <FormButtons>
                            <Button color="secondary" onClick={() => this.resetState()}>Upload Another File</Button>
                        </FormButtons>
                    </React.Fragment>
                )}
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
            this.state.fileSize < UploadFile.MAX_FILE_SIZE;
        this.setState({ isValid, status: "" });
        return isValid;
    }

    /**
     * Open a document and get its details.
     */
    private chooseFile(): void {
        const input: HTMLInputElement = window.document.createElement("input");
        input.type = "file";
        input.accept = "";
        input.click();
        input.onchange = () => {
            if (input.files && input.files.length > 0) {
                const inputFile = input.files[0];
                try {
                    const fileReader = new FileReader();
                    fileReader.onloadend = () => {
                        if (fileReader.result) {
                            const buffer = Buffer.from(fileReader.result as ArrayBuffer);

                            const sha256 = crypto.createHash("sha256");
                            sha256.update(buffer);

                            this.setState(
                                {
                                    fileName: inputFile.name,
                                    fileSize: inputFile.size,
                                    fileModified: new Date(inputFile.lastModified),
                                    fileSha256: sha256.digest("hex"),
                                    fileBuffer: buffer
                                },
                                () => this.validateData());
                        }
                    };
                    fileReader.readAsArrayBuffer(input.files[0]);
                } catch (err) {
                }
            } else {
            }
        };
    }

    /**
     * Upload the file to the API.
     */
    private async uploadFile(): Promise<void> {
        this.setState({ isBusy: true, status: "" }, async () => {
            const response = await this._apiClient.uploadFile({
                name: this.state.fileName || "",
                description: this.state.fileDescription || "",
                size: this.state.fileSize || 0,
                modified: (this.state.fileModified || new Date()).toISOString(),
                sha256: this.state.fileSha256 || "",
                data: (this.state.fileBuffer || Buffer.from("")).toString("base64")
            });

            if (response.success) {
                this.setState({
                    isBusy: false,
                    status: "",
                    statusColor: "success",
                    transactionHash: response.transactionHash,
                    ipfsHash: response.ipfs
                });
            } else {
                this.setState({
                    isBusy: false,
                    status: response.message,
                    statusColor: "danger"
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
                status: "",
                statusColor: "success",
                fileName: "",
                fileDescription: "",
                fileSize: undefined,
                fileModified: undefined,
                fileSha256: "",
                fileBuffer: undefined,
                transactionHash: "",
                ipfsHash: ""
            },
            () => this.validateData());
    }
}

export default UploadFile;
