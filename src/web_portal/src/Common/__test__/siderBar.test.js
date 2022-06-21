import { render, screen, cleanup } from "@testing-library/react";
import React, { useState } from "react";
import { expect } from "chai";
import { assert } from "chai";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { shallow, configure } from "enzyme";
import Sidebar from "../Sidebar";
const mockStore = configureMockStore();
const store = mockStore({});
describe("Test Pages Component", () => {
  it("render About component with status OK", () => {
    let onClick = () => {
      return "Hi";
    };
    const SidebarComponent = shallow(
      <Provider store={store}>
        <Sidebar
          changeCurrentLayer={onClick}
          resetZoom={onClick}
          resetZoommobile={onClick}
        />
      </Provider>
    ).exists();
    assert(SidebarComponent === true);
    expect(SidebarComponent).to.equal(true);
  });
//   it("on click to be called", () => {
//     let onClick = () => {
//       return "Hi";
//     };
//     // render(
     
//     // );
//     let component = enzyme.shallow(
//         <Sidebar
//         changeCurrentLayer={onClick}
//         resetZoom={onClick}
//         resetZoommobile={onClick}
//       />
//       );
//     // setTimeout(()=>{
//     const e = new Event("click");
//     let element =component.find(".tab-icon icons helppage").at(0).simulate("click");
//     // let element = document
//     //   .getElementsByClassName("helppage")[0]
//     //   .click();
//     if (element) {
//       element.dispatchEvent(e);
//     }
//     console.log(element, "in element");
//     // expect(onClick).toHaveBeenCalled();
//     expect(onClick).to.be.a("function");
//     // })
//   });
});
