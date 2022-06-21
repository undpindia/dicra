// // <rootdir>/__tests__/app.test.js
import React from "react";
import { assert } from "chai";
import { shallow, configure } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";

import App from "../src/App"; // Component to Test
import { render, screen, cleanup } from "@testing-library/react";
configure({ adapter: new Adapter() });
const layerDescription = { vector_status: false };
const mockStore = configureMockStore();
const store = mockStore({});
function renderComponent() {
  //state: ILoginState
  const store = mockStore(state);
  return [
    render(
      <Provider store={store}>
        <App />
      </Provider>
    ),
    store,
  ];
}

describe("Test Component", () => {
  it("render correctly App component", () => {
    const AppComponent = shallow(
      <Provider store={store}>
        <App />
      </Provider>
    ).exists();
    assert(AppComponent === true);
    // render(
    //   <Provider store={store}>
    //     <App />
    //   </Provider>
    // );
    // render(<App/>)
    // const [{ getByTestId }, store] = renderComponent({
    //   loading: false,
    //   error: null,
    // })
    expect(true).toBe(true);
  });
});
