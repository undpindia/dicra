import { render, screen, cleanup } from "@testing-library/react";
import Sidebar from "../Sidebar";
import React, { useState } from "react";
import { expect } from "chai";
import configureStore from '../../store/configStore'
import { Provider } from "react-redux";
// describe("Test Component", () => {
//   it("render siderbar component with layers", () => {
//     let onClick = () => {
//       return "Hi";
//     };
//     render(
//       <Sidebar
//       key="reset"
//         changeCurrentLayer={onClick}
//         resetZoom={onClick}
//         resetZoommobile={onClick}
//       />
//     );
//     const e = new Event("click");
//     let el = document.getElementsByClassName("layer-lists").click();;
//     if (element) {
//         element.dispatchEvent(e);
//       }
//       console.log(element, "in element");
//       // expect(onClick).toHaveBeenCalled();
//       expect(onClick).toHaveBeenCalled();
//   });
// // //   it("render colorpicker component without label", () => {
// // //     let onClick = () => {
// // //       return "Hi";
// // //     };
// // //     let scaleLength = 15;
// // //     const DEFAULT_NPREVIEWCOLORS = 5;
// // //     render(
// // //       <Colorscale
// // //         key="reset"
// // //         colorscale={[
// // //           "#fafa6e",
// // //           "#bdea75",
// // //           "#86d780",
// // //           "#54c18a",
// // //           "#23aa8f",
// // //           "#00918d",
// // //           "#007882",
// // //           "#1f5f70",
// // //           "#2a4858",
// // //         ]}
// // //         onClick={onClick}
// // //         scaleLength={scaleLength || DEFAULT_NPREVIEWCOLORS}
// // //       />
// // //     );
// // //     let el = document.getElementsByClassName("colorscale-label");
// // //     expect(el.length).to.equal(1);
// // //   });
// // // });
// // // it("width of elements should match 100/scale length", () => {
// // //   let onClick = () => {
// // //     return "Hi";
// // //   };
// // //   let scaleLength = 25;
// // //   const DEFAULT_NPREVIEWCOLORS = 5;
// // //   render(
// // //     <Colorscale
// // //       key="reset"
// // //       colorscale={[
// // //         "#fafa6e",
// // //         "#bdea75",
// // //         "#86d780",
// // //         "#54c18a",
// // //         "#23aa8f",
// // //         "#00918d",
// // //         "#007882",
// // //         "#1f5f70",
// // //         "#2a4858",
// // //       ]}
// // //       onClick={onClick}
// // //       scaleLength={scaleLength || DEFAULT_NPREVIEWCOLORS}
// // //     />
// // //   );
// // //   setTimeout(() => {
// // //     let parent = document
// // //       .getElementsByClassName("colorscale-block")[0]
// // //       .getBoundingClientRect().clientWidth;
// // //     console.log(
// // //       parent,
// // //       document
// // //         .getElementsByClassName("colorscale-swatch")[0]
// // //         .getBoundingClientRect().clientWidth,
// // //       "in val",
// // //       100 / scaleLength
// // //     );
// // //     expect(
// // //       document.getElementsByClassName("colorscale-swatch")[0].style.width
// // //     ).to.equal(100 / scaleLength);
// // //   });
// // // });

// // // it("on click to be called", () => {
// // //   let onClick = () => {
// // //     return "Hi";
// // //   };
// // //   let scaleLength = 25;
// // //   const DEFAULT_NPREVIEWCOLORS = 5;
// // //   render(
// // //     <Colorscale
// // //       key="reset"
// // //       colorscale={[
// // //         "#fafa6e",
// // //         "#bdea75",
// // //         "#86d780",
// // //         "#54c18a",
// // //         "#23aa8f",
// // //         "#00918d",
// // //         "#007882",
// // //         "#1f5f70",
// // //         "#2a4858",
// // //       ]}
// // //       onClick={onClick}
// // //       scaleLength={scaleLength || DEFAULT_NPREVIEWCOLORS}
// // //     />
// // //   );
// // //   // setTimeout(()=>{
// // //   const e = new Event("click");
// // //   let element = document.getElementsByClassName("colorscale-block")[0].click();
// // //   if (element) {
// // //     element.dispatchEvent(e);
// // //   }
// // //   console.log(element, "in element");
// // //   // expect(onClick).toHaveBeenCalled();
// // //   expect(onClick).toHaveBeenCalled();
// // //   // })
// // // });

// // it("call color scale without colorscale array", () => {
// //   let onClick = () => {
// //     return "Hi";
// //   };
// //   let scaleLength = 25;
// //   const DEFAULT_NPREVIEWCOLORS = 5;
// //   // DEFAULT_SCALE=['red'];
// //   render(
// //     <Colorscale
// //       key="reset"
// //       onClick={onClick}
// //       scaleLength={scaleLength || DEFAULT_NPREVIEWCOLORS}
// //     />
// //   );
// //   setTimeout(() => {
// //     console.log(
// //       document.getElementsByClassName("colorscale-swatch")[0].style.width,
// //       100 / DEFAULT_SCALE.length,
// //       "in values a"
// //     );
// //     expect(
// //       document.getElementsByClassName("colorscale-swatch")[0].style.width
// //     ).to.equal(100 / DEFAULT_SCALE.length);
// //   });
// });
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
