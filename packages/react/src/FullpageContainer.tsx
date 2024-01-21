import {
  type PropsWithChildren,
  useLayoutEffect,
  useRef,
  createContext,
  useState,
} from "react";
import { FullpageContainerOption } from "@safe-fullpage/core/types";
import { Fullpage } from "@safe-fullpage/core";
interface Props extends PropsWithChildren {
  option?: FullpageContainerOption;
}

export const FullpageContext = createContext<Fullpage | null | undefined>(null);

export const FullpageContainer = ({ children, option }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [_clearEvent, _setClearEvent] = useState<() => void>();
  useLayoutEffect(() => {
    if (containerRef.current) {
      const instance = new Fullpage({
        container: containerRef.current,
        ...option,
      });
      const { resizeListener, attatch, detatch } = instance.getListeners();

      window.addEventListener("resize", resizeListener);

      _setClearEvent(detatch);
      detatch();
      attatch();
    }

    return () => {
      if (_clearEvent) {
        _clearEvent();
      }
    };
  }, [containerRef, option, _clearEvent]);

  return (
    <div id="safe-fullpage-container" ref={containerRef}>
      {children}
    </div>
  );
};
