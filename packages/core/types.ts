import { type FullpageEvent } from "./event";
export type FullpageElementType = "content" | "footer";
declare global {
  interface Window {
    _touchStart: number | null;
    addEventListener(
      type: "safefullpage",
      listener: (event: FullpageEvent) => void
    ): void;
    removeEventListener(
      type: "safefullpage",
      listener: (event: FullpageEvent) => void
    ): void;
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
export enum DeviceType {
  MOBILE = "mobile",
  DESKTOP = "desktop",
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
  onFullpageStart?: (event: FullpageEvent) => void | Promise<void>;
  onFullpageEnd?: (event: FullpageEvent) => void | Promise<void>;
}
export interface fullpageFactoryOption extends FullpageContainerOption {
  container: HTMLElement;
}

export interface ScrollLockOption {
  enableKeydown: boolean;
}

export interface FullpageEventInit {
  prevSectionIdx: number;
  sectionIdx: number;
  isStart: boolean;
  isEnd: boolean;
  direction: Direction;
  deviceType: DeviceType;
  container: HTMLElement;
  scrollDelay: number;
  touchMovementThreshold: number;
}

export type FullpageEventState = "staged" | "executed";
