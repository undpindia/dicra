import { render, screen, cleanup } from "@testing-library/react";
import Sidebar from "../Sidebar";
import React, { useState } from "react";
import { expect } from "chai";
import configureStore from '../../store/configStore'
import { Provider } from "react-redux";
const store=configureStore()
it("on click to be called", () => {
  let onClick = () => {
    return "Hi";
  };
  let scaleLength = 25;
  const DEFAULT_NPREVIEWCOLORS = 5;
  render(
    <Provider store={store}>
      <Sidebar
        key="reset"
        changeCurrentLayer={onClick}
        resetZoom={onClick}
        resetZoommobile={onClick}
      />
    </Provider>
  );
  setTimeout(() => {
    const e = new Event("click");
    let element = document.getElementsByClassName("layer-lists")[0].click();
    if (element) {
      element.dispatchEvent(e);
    }
    console.log(element, "in element");
    // expect(onClick).toHaveBeenCalled();
    expect(onClick).toHaveBeenCalled();
  });
});
