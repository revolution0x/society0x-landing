/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"
import OurAppBar from "./OurAppBar";
import OurDrawers from "./OurDrawers";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Header from "./header"
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/lib/integration/react';
//import {getMemberProfileFromAddress} from "./services/social0x";
import {store, persistor} from "../state";
import '../components/material-ui.scss';
import '../components/layout.css';



const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    type: 'dark',
    primary: {
      50: '#FFFFFF',
      100: '#2C2C2C',
      200: '#242424',
      300: '#0F0F0F',
      500: '#000000',
      A100: '#000000',
      A200: '#0F0F0F',
      A400: '#242424',
      A700: '#2C2C2C'
    },
  }
});

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        
        <MuiThemeProvider theme={theme}>
          <Provider store={store}>
            <PersistGate persistor={persistor}>
              <OurDrawers />
              <OurAppBar />
              {children}
            </PersistGate>
          </Provider>
        </MuiThemeProvider>
        
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
