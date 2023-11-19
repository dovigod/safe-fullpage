import { type PropsWithChildren, useLayoutEffect, useRef } from "react";
import { FullpageContainerOption } from "@safe-fullpage/core/types";
import { fullpageFactory } from "@safe-fullpage/core";
interface Props extends PropsWithChildren {
  option?: FullpageContainerOption;
}

export const FullpageContainer = ({ children }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (containerRef.current) {
      const { resizeListener, attatchFullpage, detatchFullpage } =
        fullpageFactory({
          container: containerRef.current,
        });

      window.addEventListener("resize", resizeListener);
      detatchFullpage();
      attatchFullpage();
    }
  }, [containerRef]);

  return (
    <div id="safe-fullpage-container" ref={containerRef}>
      {children}
    </div>
  );
};
