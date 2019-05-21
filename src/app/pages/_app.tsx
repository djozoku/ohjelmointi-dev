import CssBaseLine from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import withRedux from 'next-redux-wrapper';
import App, { Container } from 'next/app';
import Head from 'next/head';
import React from 'react';
import JssProvider from 'react-jss/lib/JssProvider';
import { Provider as ReduxProvider } from 'react-redux';
import { Store } from 'redux';
import initApollo from '../lib/initApollo';
import createStore from '../lib/store';
import withMaterialUI, { MuiContext } from '../lib/withMaterialUI';

interface TheAppProps {
  store: Store;
}

class TheApp extends App<TheAppProps> {
  public static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({ ctx });
    }
    return { pageProps };
  }
  public muiContext: MuiContext;
  public apolloClient: ApolloClient<NormalizedCacheObject>;
  constructor(props) {
    super(props);
    this.muiContext = withMaterialUI();
    this.apolloClient = initApollo();
  }
  public componentDidMount() {
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles) {
      // @ts-ignore
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }

  public render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Container>
        <Head>
          <title>ohjelmointi.dev</title>
        </Head>
        <ReduxProvider store={store}>
          <JssProvider
            registry={this.muiContext.sheetsRegistry}
            generateClassName={this.muiContext.generateClassName}
          >
            <MuiThemeProvider
              theme={this.muiContext.theme}
              sheetsManager={this.muiContext.sheetsManager}
            >
              <CssBaseLine />
              <Component muiContext={this.muiContext} {...pageProps} />
            </MuiThemeProvider>
          </JssProvider>
        </ReduxProvider>
      </Container>
    );
  }
}

export default withRedux(createStore(this.apolloClient))(TheApp);
