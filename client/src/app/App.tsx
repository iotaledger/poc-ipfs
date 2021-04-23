import "iota-css-theme";
import { Footer, FoundationDataHelper, GoogleAnalytics, Header, LayoutAppSingle, SideMenu, StatusMessage } from "iota-react-components";
import React, { Component, ReactNode } from "react";
import { Link, Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import logo from "../assets/logo.svg";
import { ServiceFactory } from "../factories/serviceFactory";
import { IConfiguration } from "../models/config/IConfiguration";
import { ConfigurationService } from "../services/configurationService";
import { IpfsService } from "../services/ipfsService";
import { TangleExplorerService } from "../services/tangleExplorerService";
import { AppState } from "./AppState";
import RetrieveFile from "./routes/RetrieveFile";
import { RetrieveFileParams } from "./routes/RetrieveFileParams";
import UploadFile from "./routes/UploadFile";

/**
 * Main application class.
 */
class App extends Component<RouteComponentProps, AppState> {
    /**
     * The configuration for the app.
     */
    private _configuration?: IConfiguration;

    /**
     * Create a new instance of App.
     * @param props The props.
     */
    constructor(props: any) {
        super(props);

        this.state = {
            isBusy: true,
            status: "Loading Configuration...",
            statusColor: "info",
            isSideMenuOpen: false
        };
    }

    /**
     * The component mounted.
     */
    public async componentDidMount(): Promise<void> {
        try {
            this.setState({ foundationData: await FoundationDataHelper.loadData() });

            const configService = new ConfigurationService<IConfiguration>();
            const configId = process.env.REACT_APP_CONFIG_ID || "local";
            const config = await configService.load(`/data/config.${configId}.json`);

            ServiceFactory.register("configuration", () => configService);
            ServiceFactory.register("ipfs", () => new IpfsService(config.ipfsGateway));
            ServiceFactory.register("tangleExplorer", () => new TangleExplorerService(config.tangleExplorer));

            this._configuration = config;

            this.setState({
                isBusy: false,
                status: "",
                statusColor: "success"
            });
        } catch (err) {
            this.setState({
                isBusy: false,
                status: err.message,
                statusColor: "danger"
            });
        }
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <React.Fragment>
                <Header
                    title="IOTA IPFS"
                    foundationData={this.state.foundationData}
                    logo={logo}
                    compact={true}
                    hamburgerClick={() => this.setState({ isSideMenuOpen: !this.state.isSideMenuOpen })}
                    hamburgerMediaQuery="tablet-up-hidden"
                />
                <nav className="tablet-down-hidden">
                    <Link className="link" to="/">Upload File</Link>
                    <Link className="link" to="/retrieve">Retrieve File</Link>
                </nav>
                <SideMenu
                    isMenuOpen={this.state.isSideMenuOpen}
                    handleClose={() => this.setState({ isSideMenuOpen: false })}
                    history={this.props.history}
                    items={[
                        {
                            name: "IOTA IPFS",
                            isExpanded: true,
                            items: [
                                {
                                    items: [
                                        {
                                            name: "Upload File",
                                            link: "/"
                                        },
                                        {
                                            name: "Retrieve File",
                                            link: "/retrieve"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]}
                    selectedItemLink={this.props.location.pathname}
                    mediaQuery="tablet-up-hidden"
                />
                <section className="content">
                    <LayoutAppSingle>
                        <StatusMessage
                            status={this.state.status}
                            color={this.state.statusColor}
                            isBusy={this.state.isBusy}
                        />
                        {!this.state.status && (
                            <Switch>
                                <Route exact={true} path="/" component={() => (<UploadFile hash={Date.now()} />)} />
                                <Route
                                    exact={true}
                                    path="/retrieve/:messageId?/:hash?"
                                    component={(props: RouteComponentProps<RetrieveFileParams>) =>
                                        (<RetrieveFile {...props} />)}
                                />
                            </Switch>
                        )}
                    </LayoutAppSingle>
                </section>
                <Footer
                    history={this.props.history}
                    foundationData={this.state.foundationData}
                    sections={[
                        {
                            heading: "IOTA IPFS",
                            links: [
                                {
                                    href: "/",
                                    text: "Upload File"
                                },
                                {
                                    href: "/retrieve",
                                    text: "Retrieve File"
                                },
                                {
                                    href: "https://docs.iota.org/docs/blueprints/0.1/tangle-data-storage/overview",
                                    text: "Blueprint"
                                },
                                {
                                    href: "https://github.com/iotaledger/poc-ipfs",
                                    text: "GitHub"
                                }
                            ]
                        }]
                    }
                />
                <GoogleAnalytics id={this._configuration && this._configuration.googleAnalyticsId} />
            </React.Fragment>
        );
    }
}

export default withRouter(App);
