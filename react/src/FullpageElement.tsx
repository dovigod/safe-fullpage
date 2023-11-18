import { PropsWithChildren, useLayoutEffect, useRef } from "react";
import styled from "styled-components";
import type { SnapMethod } from "../../core/types";

interface Props extends PropsWithChildren {
  snapMethod?: SnapMethod;
}
const FullpageElement = ({ children, snapMethod }: Props) => {
  const elementRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (elementRef.current) {
      elementRef.current.baseSnapMethod = "bottom";
      if (snapMethod) {
        elementRef.current.baseSnapMethod = snapMethod;
      }
    }
  }, [elementRef, snapMethod]);
  return (
    <Container className="full-page-element" ref={elementRef}>
      {children}
    </Container>
  );
};
export default FullpageElement;

const Container = styled.div`
  width: 100%;
  /* height: 100%; */
  position: relative;
`;
