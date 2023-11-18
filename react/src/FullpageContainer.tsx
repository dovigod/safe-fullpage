/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from "styled-components";
import { type PropsWithChildren, useLayoutEffect, useRef } from "react";
import FullpageElement from "./FullpageElement";
import { FullpageContainerOption } from "../../core/index";
import { eventListenerFactory } from "../../core/index";

interface Props extends PropsWithChildren {
  option?: FullpageContainerOption;
}

const FullpageContainer = ({ children }: Props) => {
  // const { enableKeydown } = option;
  const containerRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (containerRef.current) {
      const { resizeListener, attatchFullpage, detatchFullpage } =
        eventListenerFactory({
          container: containerRef.current,
        });

      window.addEventListener("resize", resizeListener);
      detatchFullpage();
      attatchFullpage();
    }
  }, [containerRef]);

  return (
    <Container id="full-page-container" ref={containerRef}>
      {children instanceof Array ? (
        children.map((component: any, idx: number) => {
          return (
            <FullpageElement key={`fullpageElement-${idx}`}>
              {component}
            </FullpageElement>
          );
        })
      ) : children ? (
        <FullpageElement>{children}</FullpageElement>
      ) : null}
    </Container>
  );
};

export default FullpageContainer;

const Container = styled.div`
  --translate-value: 0;
  --viewport-height: 100dvh;
  width: 100%;
  position: relative;
  transition: transform 0.9s ease 0s;
  transform: translateY(calc(var(--viewport-height) * var(--translate-value)));
  height: 100vh;
  height: 100dvh;
  max-height: var(--viewport-height);
  position: fixed;
`;
