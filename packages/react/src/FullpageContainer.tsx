import { type PropsWithChildren, useLayoutEffect, useRef } from "react";
import { FullpageContainerOption } from "@safe-fullpage/core/types";
import { fullpageFactory } from "@safe-fullpage/core";
interface Props extends PropsWithChildren {
  option?: FullpageContainerOption;
}

export const FullpageContainer = ({ children, option }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (containerRef.current) {
      const { resizeListener, attatchFullpage, detatchFullpage } =
        fullpageFactory({
          container: containerRef.current,
          ...option,
        });

      window.addEventListener("resize", resizeListener);
      detatchFullpage();
      attatchFullpage();
    }
  }, [containerRef, option]);

  return (
    <div id="safe-fullpage-container" ref={containerRef}>
      {children}
    </div>
  );
};
