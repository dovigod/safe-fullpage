import { ERROR_CODE } from "./error";
import {
  DeviceType,
  Direction,
  FullpageEventInit,
  FullpageEventState,
} from "./types";

function* stateGen() {
  yield "staged";
  yield "processing";
  yield "fulfilled";
  throw {
    code: ERROR_CODE.UNKNOWN_STATE_TRANSITION,
    msg: "Seems you are trying to manipulate state which is already fulfilled. Recommend not to transit fulfilled state since it might cause side effects.",
  };
}
export class FullpageEvent extends Event {
  private _stateGenerator: Generator<"staged" | "processing" | "fulfilled">;
  direction: Direction;
  prevSectionIdx: number;
  sectionIdx: number;
  isStart: boolean;
  isEnd: boolean;
  deviceType: DeviceType;
  safeFullpageContainer: HTMLElement;
  scrollDelay: number;
  touchMovementThreshold: number;
  private _state: FullpageEventState;

  constructor(init: FullpageEventInit) {
    super("safefullpage", { bubbles: false, cancelable: false });

    this.direction = init.direction;
    this.prevSectionIdx = init.prevSectionIdx;
    this.sectionIdx = init.sectionIdx;
    this.isStart = init.isStart;
    this.isEnd = init.isEnd;
    this.deviceType = init.deviceType;
    this.safeFullpageContainer = init.container;
    this.scrollDelay = init.scrollDelay;
    this.touchMovementThreshold = init.touchMovementThreshold;
    this._stateGenerator = stateGen();
    this._state = this._stateGenerator.next().value;
  }

  stateTransition() {
    this._state = this._stateGenerator.next().value;
  }

  get state() {
    return this._state;
  }
  set state(_: unknown) {
    throw {
      code: ERROR_CODE.INVALID_APPROACH,
      msg: "manipulating state is not allowed",
    };
  }
}
