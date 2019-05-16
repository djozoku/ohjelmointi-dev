import Document, { Head, Main, NextScript } from 'next/document';
import React from 'react';
import flush from 'styled-jsx/server';
import { MuiContext } from '../lib/withMaterialUI';

interface TheDocumentProps {
  muiContext: MuiContext;
}

class TheDocument extends Document<TheDocumentProps> {
  public static getInitialProps(ctx) {
    let muiContext: MuiContext | null = null;
    const page = ctx.renderPage((Component) => {
      const WrappedComponent = (props) => {
        muiContext = props.muiContext;
        return <Component {...props} />;
      };
      return WrappedComponent;
    });

    let css: string = '';
    if (muiContext) {
      // @ts-ignore
      css = muiContext.sheetsRegistry.toString();
    }
    return {
      ...page,
      muiContext,
      styles: (
        <>
          <style id="jss-server-side" dangerouslySetInnerHTML={{ __html: css }} />
          {flush() || null}
        </>
      ),
    };
  }

  public render() {
    const { muiContext } = this.props;
    return (
      <html lang="en" dir="ltr">
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />
          <meta name="theme-color" content={muiContext ? muiContext.theme.palette.primary.main : undefined} />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default TheDocument;
