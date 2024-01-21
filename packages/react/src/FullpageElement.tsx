import { PropsWithChildren } from "react";
// import type { FullpageElementType } from "@safe-fullpage/core/types";
interface Props extends PropsWithChildren {
  // elementType?: FullpageElementType;
}
export const FullpageElement = ({ children }: Props) => {
  return <div className="safe-fullpage-element">{children}</div>;
};
