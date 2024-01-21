import { type PropsWithChildren, useLayoutEffect, useRef } from "react";
import { FullpageContainerOption } from "@safe-fullpage/core/types";
import { Fullpage } from "@safe-fullpage/core";
interface Props extends PropsWithChildren {
  option?: FullpageContainerOption;
}

export const FullpageContainer = ({ children, option }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (containerRef.current) {
      const instance = new Fullpage({
        container: containerRef.current,
        ...option,
      });
      const { resizeListener, attatch, detatch } = instance.getListeners();
      // const { resizeListener, attatchFullpage, detatchFullpage } =
      //   fullpageFactory({
      //     container: containerRef.current,
      //     ...option,
      //   });

      window.addEventListener("resize", resizeListener);
      // detatchFullpage();
      // attatchFullpage();
      detatch();
      attatch();

      setTimeout(() => {
        instance.scrollTo(3);

        setTimeout(() => {
          instance.scrollTo(0);
        }, 2000);
      }, 3000);
    }
  }, [containerRef, option]);

  return (
    <div id="safe-fullpage-container" ref={containerRef}>
      {children}
    </div>
  );
};
