import "iota-css-theme";
import { Alert, Footer, Header } from "iota-react-components";
import React, { Component, ReactNode } from "react";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import logo from "../assets/logo.svg";
import contentHomePage from "../content/contentHomePage.json";
import { ServiceFactory } from "../factories/serviceFactory";
import { IConfiguration } from "../models/config/IConfiguration";
import { ConfigurationService } from "../services/configurationService";
import { IpfsService } from "../services/ipfsService";
import { AppState } from "./AppState";
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
            const config = await configService.load("/data/config.json");

            ServiceFactory.register("configuration", () => configService);
            ServiceFactory.register("ipfs", () => new IpfsService(config.ipfsGateway));

            this.setState({
                status: "",
                statusColor: "success"
            });
        } catch (err) {
            this.setState({
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
                <section className="content">
                    <Alert status={this.state.status} color={this.state.statusColor} />
                    {!this.state.status && (
                        <Switch>
                            <Route exact={true} path="/" component={UploadFile} />
                        </Switch>
                    )}
                </section>
                <Footer history={this.props.history} sections={contentHomePage.footerSections} staticContent={contentHomePage.footerStaticContent} />
            </React.Fragment>
        );
    }
}

export default withRouter(App);
