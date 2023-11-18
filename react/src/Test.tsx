import FullpageContainer from "./FullpageContainer";
import styled from "styled-components";

const Test = () => {
  return (
    <FullpageContainer>
      <Section1></Section1>
      <Section2></Section2>
      <Section3></Section3>
    </FullpageContainer>
  );
};
export default Test;

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
  /* transition: all 750ms ease-in-out; */
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
