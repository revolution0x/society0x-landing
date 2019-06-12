import {combineReducers} from "redux";
import showLeftMenu from "./showLeftMenu";
import setActiveAccount from "./setActiveAccount";
import setWeb3 from "./setWeb3";
import showNavigationWrapper from "./showNavigationWrapper";
import showLandingSite from "./showLandingSite";
import isConsideredMobile from './isConsideredMobile';

export default combineReducers({
    showLeftMenu,
    setActiveAccount,
    setWeb3,
    showNavigationWrapper,
    showLandingSite,
    isConsideredMobile,
})