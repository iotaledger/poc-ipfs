import "iota-css-theme";
import { Footer, Header, LayoutAppSingle, StatusMessage } from "iota-react-components";
import React, { Component, ReactNode } from "react";
import { Link, Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import logo from "../assets/logo.svg";
import contentHomePage from "../content/contentHomePage.json";
import { ServiceFactory } from "../factories/serviceFactory";
import { IConfiguration } from "../models/config/IConfiguration";
import { ConfigurationService } from "../services/configurationService";
import { IpfsService } from "../services/ipfsService";
import { TangleExplorerService } from "../services/tangleExplorerService";
import { AppState } from "./AppState";
import RetrieveFile from "./routes/RetrieveFile";
import UploadFile from "./routes/UploadFile";

/**
 * Main application class.
 */
class App extends Component<RouteComponentProps, AppState> {
    /**
     * Create a new instance of App.
     * @param props The props.
     */
    constructor(props: any) {
        super(props);

        this.state = {
            isBusy: true,
            status: "Loading Configuration...",
            statusColor: "info"
        };
    }

    /**
     * The component mounted.
     */
    public async componentDidMount(): Promise<void> {
        try {
            const configService = new ConfigurationService<IConfiguration>();
            const configId = process.env.CONFIG_ID || "dev";
            const config = await configService.load(`/data/config.${configId}.json`);

            ServiceFactory.register("configuration", () => configService);
            ServiceFactory.register("ipfs", () => new IpfsService(config.ipfsGateway));
            ServiceFactory.register("tangleExplorer", () => new TangleExplorerService(config.tangleExplorer));

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
                <Header title="IOTA IPFS" topLinks={contentHomePage.headerTopLinks} logo={logo} compact={true} />
                <nav>
                    <Link className="link" to="/">Upload File</Link>
                    <Link className="link" to="/retrieve">Retrieve File</Link>
                </nav>
                <section className="content">
                    <LayoutAppSingle>
                        <StatusMessage status={this.state.status} color={this.state.statusColor} isBusy={this.state.isBusy} />
                        {!this.state.status && (
                            <Switch>
                                <Route exact={true} path="/" component={() => (<UploadFile hash={Date.now()} />)} />
                                <Route exact={true} path="/retrieve" component={() => (<RetrieveFile hash={Date.now()} />)} />
                            </Switch>
                        )}
                    </LayoutAppSingle>
                </section>
                <Footer history={this.props.history} sections={contentHomePage.footerSections} staticContent={contentHomePage.footerStaticContent} />
            </React.Fragment>
        );
    }
}

export default withRouter(App);
