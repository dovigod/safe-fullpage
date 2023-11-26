export type FullpageElementType = "content" | "footer";
declare global {
  interface Window {
    _touchStart: number | null;
  }
  interface Element {
    elementType: FullpageElementType;
  }
}
export enum Direction {
  UP = "up",
  DOWN = "down",
  NEUTRAL = "neutral",
}

export type CSSTimingKeyword =
  | "ease"
  | "ease-in"
  | "linear"
  | "ease-in-out"
  | "ease-out";
export interface FullpageContainerOption {
  enableKeydown?: boolean;
  scrollDelay?: number;
  touchMovementThreshold?: number;
  duration?: number;
  timingMethod?: CSSTimingKeyword;
}
export interface fullpageFactoryOption extends FullpageContainerOption {
  container: HTMLElement;
}

export interface ScrollLockOption {
  enableKeydown: boolean;
}
