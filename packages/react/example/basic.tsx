import React from "react";
import { createRoot } from "react-dom/client";
import { FullpageContainer, FullpageElement } from "../src/index";
import styled from "styled-components";

const Section1 = styled.section`
  background-color: yellow;
  display: flex;
  font-size: 32px;
  width: 100%;
  height: 100%;
  height: 100dvh;
  position: relative;
  display: flex;
  justify-content: center;
`;
const Section2 = styled.section`
  background-color: blue;
  display: flex;
  height: 100%;
  font-size: 32px;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  position: relative;
  display: flex;
  justify-content: center;
`;
const Section3 = styled.section`
  background-color: red;
  display: flex;
  height: 100%;
  font-size: 32px;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  position: relative;
  display: flex;
  justify-content: center;
`;

const Footer = styled.div`
  background-color: purple;
  width: 100%;
  height: 300px;
`;

const Test = () => {
  return (
    <FullpageContainer option={{ duration: 3000, timingMethod: "linear" }}>
      <FullpageElement>
        <Section1></Section1>
      </FullpageElement>
      <FullpageElement>
        <Section2></Section2>
      </FullpageElement>
      <FullpageElement>
        <Section3></Section3>
      </FullpageElement>
      <FullpageElement elementType="footer">
        <Footer />
      </FullpageElement>
    </FullpageContainer>
  );
};
const domNode = document.getElementById("root");
const root = createRoot(domNode!);
export default root.render(<Test />);
