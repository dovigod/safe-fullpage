export enum Direction {
  UP = "up",
  DOWN = "down",
  NEUTRAL = "neutral",
}
export interface FullpageContainerOption {
  enableKeydown?: boolean;
  scrollDelay?: number;
  touchMovementThreshold?: number;
}
export interface EventListenerOption extends FullpageContainerOption {
  container: HTMLDivElement;
}

export interface ScrollLockOption {
  enableKeydown: boolean;
}
