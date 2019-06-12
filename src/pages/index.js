import React, {Component} from "react";

import LandingZone from "../components/LandingZone";
import Layout from "../components/layout";
import SEO from "../components/seo";
import {store} from '../state';

class IndexPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLeftMenu: store.getState().showLeftMenu,
    };
    store.subscribe(() => {
      this.setState({
        showLeftMenu: store.getState().showLeftMenu,
      });
    });
  }
  render() {
    const {showLeftMenu} = this.state;
    console.log("showLeftMenu", showLeftMenu);
    return (
      <Layout>
        <SEO title="Our Revolution Has Arrived" />
        <LandingZone/>
      </Layout>)
  }
}

export default IndexPage
