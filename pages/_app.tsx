import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import type {
  AppProps,
  // NextWebVitalsMetric
} from 'next/app';
import Head from 'next/head';

import { Provider } from 'react-redux';

import Favicon from '@/components/Favicon';
import Font from '@/components/Font';

import useStore from '@/store/store';

// export function reportWebVitals(metric: NextWebVitalsMetric) {
//   console.log(metric);
// }

const WrappedApp = ({ Component, pageProps }: AppProps) => {
  const store = useStore(pageProps.initialReduxState);

  return (
    <>
      <Head>
        <title>Notes App</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />

        <Favicon />
        <Font />
      </Head>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
};

export default WrappedApp;
