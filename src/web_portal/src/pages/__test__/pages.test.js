import { render, screen, cleanup } from "@testing-library/react";
import React, { useState } from "react";
import { expect } from "chai";
import { assert } from "chai";
import About from "../About.js";
import Analytics from "../Analytics";
import Policy from "../Policy";
import Terms from "../Terms"
import FieldStories from "../FieldStories.js";
import Data4Policy from "../Data4Policy.js";
import enzyme from "enzyme";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { shallow, configure } from "enzyme";

const mockStore = configureMockStore();
const store = mockStore({});
describe("Test Pages Component", () => {
  it("render About component with status OK", () => {
    const AboutComponent = shallow(
      <Provider store={store}>
        <About />
      </Provider>
    ).exists();
    assert(AboutComponent === true);
    expect(AboutComponent).to.equal(true);
  });
  it("render Analytics component with status OK", () => {
    const AnalyticsComponent = shallow(
      <Provider store={store}>
        <Analytics />
      </Provider>
    ).exists();
    assert(AnalyticsComponent === true);
    expect(AnalyticsComponent).to.equal(true);
  });
  it("render Policy component with status OK", () => {
    const PolicyComponent = shallow(
      <Provider store={store}>
        <Policy/>
      </Provider>
    ).exists();
    assert(PolicyComponent === true);
    expect(PolicyComponent).to.equal(true);
  });
  it("render Terms component with status OK", () => {
    const TermsComponent = shallow(
      <Provider store={store}>
        <Terms/>
      </Provider>
    ).exists();
    assert(TermsComponent === true);
    expect(TermsComponent).to.equal(true);
  });
  it("render Terms component with status OK", () => {
    const FieldStoriesComponent = shallow(
      <Provider store={store}>
        <FieldStories/>
      </Provider>
    ).exists();
    assert(FieldStoriesComponent === true);
    expect(FieldStoriesComponent).to.equal(true);
  });
  it("render Terms component with status OK", () => {
    const Data4PolicyComponent = shallow(
      <Provider store={store}>
        <Data4Policy/>
      </Provider>
    ).exists();
    assert(Data4PolicyComponent === true);
    expect(Data4PolicyComponent).to.equal(true);
  });
});
