export interface CalldataType {
    chainId: number;
    hash: string;
    token: string;
    value: string;
    expectValue?: string;
    timestamp: number;
    slipPoint?: number;
    crossTokenUserExpectValue?: string;
  }
  export enum SwapOrderType {
    None,
    UA,
    CrossAddr,
    CrossToken
  }
  export interface SwapOrder {
    chainId: number;
    hash: string;
    from: string;
    to: string;
    token: string;
    value: string;
    calldata: CalldataType
    type: SwapOrderType;
  }