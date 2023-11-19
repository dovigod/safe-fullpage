import { PropsWithChildren, useLayoutEffect, useRef } from "react";
import type { FullpageElementType } from "@safe-fullpage/core/types";

interface Props extends PropsWithChildren {
  elementType?: FullpageElementType;
}
export const FullpageElement = ({ children, elementType }: Props) => {
  const elementRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (elementRef.current) {
      elementRef.current.elementType = "content";
      if (elementType) {
        elementRef.current.elementType = elementType;
      }
    }
  }, [elementRef, elementType]);
  return (
    <div className="safe-fullpage-element" ref={elementRef}>
      {children}
    </div>
  );
};
