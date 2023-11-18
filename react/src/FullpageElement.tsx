import { PropsWithChildren, useRef } from "react";
import styled from "styled-components";
const FullpageElement = ({ children }: PropsWithChildren) => {
  const elementRef = useRef<HTMLDivElement>(null);
  return (
    <Container className="full-page-element" ref={elementRef}>
      {children}
    </Container>
  );
};
export default FullpageElement;

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
