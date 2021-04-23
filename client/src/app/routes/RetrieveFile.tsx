import crypto from "crypto";
import { Button, ClipboardHelper, Fieldset, Form, FormActions, FormStatus, Heading, ScrollHelper, Success } from "iota-react-components";
import React, { Component, ReactNode } from "react";
import { RouteComponentProps } from "react-router";
import { SHA3 } from "sha3";
import { ServiceFactory } from "../../factories/serviceFactory";
import { IConfiguration } from "../../models/config/IConfiguration";
import { ApiClient } from "../../services/apiClient";
import { ConfigurationService } from "../../services/configurationService";
import { IpfsService } from "../../services/ipfsService";
import { RetrieveFileParams } from "./RetrieveFileParams";
import { RetrieveFileState } from "./RetrieveFileState";

/**
 * Component which will load file data from the tangle and validate it.
 */
class RetrieveFile extends Component<RouteComponentProps<RetrieveFileParams>, RetrieveFileState> {
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
     * Create a new instance of RetrieveFile.
     * @param props The props.
     */
    constructor(props: RouteComponentProps<RetrieveFileParams>) {
        super(props);

        this._configuration = ServiceFactory.get<ConfigurationService<IConfiguration>>("configuration").get();
        this._apiClient = new ApiClient(this._configuration.apiEndpoint);
        this._ipfsService = ServiceFactory.get<IpfsService>("ipfs");

        this.state = {
            isBusy: false,
            isValid: false,
            isErrored: false,
            status: "",
            fileName: "",
            fileDescription: "",
            fileSize: undefined,
            fileModified: undefined,
            fileAlgorithm: undefined,
            fileHash: "",
            fileBuffer: undefined,
            messageId: this.props.match.params &&
                this.props.match.params.messageId === undefined ? "" : this.props.match.params.messageId,
            ipfsHash: ""
        };
    }

    /**
     * The component mounted.
     */
    public async componentDidMount(): Promise<void> {
        if (this.validateData()) {
            await this.retrieveFile();
        }
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <React.Fragment>
                {!this.state.fileName && (
                    <React.Fragment>
                        <Heading level={1}>Retrieve File</Heading>
                        <p>Please enter the message id of the file to retrieve from the Tangle and IPFS.</p>
                        <Form>
                            <Fieldset>
                                <label>Message ID</label>
                                <input
                                    type="text"
                                    placeholder="Please enter the message id"
                                    value={this.state.messageId}
                                    onChange={e => this.setState(
                                        { messageId: e.target.value }, () => this.validateData())}
                                    readOnly={this.state.isBusy}
                                />
                            </Fieldset>
                            <FormActions>
                                <Button
                                    disabled={!this.state.isValid || this.state.isBusy}
                                    onClick={async () => this.retrieveFile()}
                                >
                                    Retrieve
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
                {this.state.fileName && (
                    <React.Fragment>
                        <Heading level={1}>File Validated</Heading>
                        <p>The file data has successfully been retrieved from the Tangle.</p>
                        <Form>
                            <Fieldset small={true}>
                                <label>Name</label>
                                <span>{this.state.fileName}</span>
                            </Fieldset>
                            <Fieldset small={true}>
                                <label>Description</label>
                                <span>{this.state.fileDescription}</span>
                            </Fieldset>
                            <Fieldset small={true}>
                                <label>Size</label>
                                <span>
                                    {this.state.fileSize} bytes
                                </span>
                            </Fieldset>
                            {this.state.fileModified && (
                                <Fieldset small={true}>
                                    <label>Modified Date</label>
                                    <span>{this.state.fileModified.toISOString()}</span>
                                </Fieldset>
                            )}
                            <Fieldset small={true}>
                                <label>Algorithm</label>
                                <span>{this.state.fileAlgorithm}</span>
                            </Fieldset>
                            <Fieldset small={true}>
                                <label>Hash</label>
                                <span>{this.state.fileHash}</span>
                            </Fieldset>
                            {this.state.ipfsHash && (
                                <Fieldset small={true}>
                                    <label>IPFS Hash</label>
                                    <span>{this.state.ipfsHash}</span>
                                </Fieldset>
                            )}
                            {this.state.ipfsFileHash && (
                                <Fieldset small={true}>
                                    <label>IPFS File Hash</label>
                                    <span>{this.state.ipfsFileHash}</span>
                                </Fieldset>
                            )}
                        </Form>

                        <FormStatus
                            message={this.state.status}
                            isBusy={this.state.isBusy}
                            isError={this.state.isErrored}
                        />

                        {this.state.fileBuffer && (
                            <React.Fragment>
                                <Success
                                    message={
                                        `The file on IPFS has been successfully validated against the data` +
                                        ` on the Tangle, the file is linked below:`}
                                />
                                <br />
                                <div>
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
                                </div>
                            </React.Fragment>
                        )}

                        <FormActions>
                            <Button color="primary" onClick={() => this.resetState()}>Retrieve Another File</Button>
                        </FormActions>
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
                </a> or
                            view the source code on
                <a
                        href="https://github.com/iotaledger/poc-ipfs"
                        target="_blank"
                        rel="noopener noreferrer"
                >
                        GitHub
                </a>.
                </p>
            </React.Fragment>
        );
    }

    /**
     * Validate the data in the form.
     * @returns True if the data is valid.
     */
    private validateData(): boolean {
        const isValid = /^[\da-z]{64}/.test(this.state.messageId) && this.state.messageId.length === 64;
        this.setState({ isValid, status: "" });
        return isValid;
    }

    /**
     * Validate the file using the API.
     */
    private async retrieveFile(): Promise<void> {
        this.setState(
            {
                isBusy: true,
                status: "Loading file data from the Tangle, please wait...",
                isErrored: false
            },
            async () => {
                const response = await this._apiClient.retrieveFile({
                    messageId: this.state.messageId || ""
                });

                if (response.success) {
                    this.setState(
                        {
                            isBusy: true,
                            status: "Loading file from IPFS, please wait...",
                            isErrored: false,
                            fileName: response.name,
                            fileSize: response.size,
                            fileModified: response.modified ? new Date(response.modified) : new Date(0),
                            fileDescription: response.description,
                            fileAlgorithm: response.algorithm,
                            fileHash: response.hash,
                            ipfsHash: response.ipfs
                        },
                        async () => {
                            let ipfsFileHash;
                            try {
                                if (response.ipfs) {
                                    const buffer = await this._ipfsService.getFile(response.ipfs);

                                    if (buffer && response.algorithm) {
                                        if (response.algorithm === "sha256") {
                                            const hashAlgo = crypto.createHash(response.algorithm);
                                            hashAlgo.update(buffer);
                                            ipfsFileHash = hashAlgo.digest("hex");
                                        } else {
                                            const hashAlgo = new SHA3(256);
                                            hashAlgo.update(buffer);
                                            ipfsFileHash = hashAlgo.digest("hex");
                                        }

                                        if (ipfsFileHash === response.hash) {
                                            this.setState({
                                                isBusy: false,
                                                status: "",
                                                isErrored: false,
                                                fileBuffer: buffer,
                                                ipfsFileHash: ipfsFileHash
                                            });
                                        } else {
                                            throw new Error(
                                                `The hash of the file loaded from IPFS does not match`
                                                + `the data stored on the Tangle`
                                            );
                                        }
                                    } else {
                                        throw new Error("Could not load file from IPFS");
                                    }
                                } else {
                                    throw new Error("IPFS hash is missing from response");
                                }
                            } catch (err) {
                                this.setState({
                                    isBusy: false,
                                    status: err.message,
                                    isErrored: true,
                                    ipfsFileHash: ipfsFileHash
                                });
                            }
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
                fileAlgorithm: undefined,
                fileHash: "",
                fileBuffer: undefined,
                messageId: "",
                ipfsHash: ""
            },
            () => {
                this.validateData();
                ScrollHelper.scrollRoot();
            });
    }
}

export default RetrieveFile;
