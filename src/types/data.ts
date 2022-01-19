import BigNumber from "bignumber.js";
import { AssetType, Frontier, Memo, MemoType } from "xdb-digitalbits-sdk";

export type TradeId = string;
export type OfferId = string;

export interface Account {
  publicKey: string;
}

export interface Issuer {
  key: string;
  name?: string;
  url?: string;
  hostName?: string;
}

export interface NativeToken {
  type: AssetType;
  code: string;
}

export interface AssetToken {
  type: AssetType;
  code: string;
  issuer: Issuer;
  anchorAsset?: string;
  numAccounts?: BigNumber;
  amount?: BigNumber;
  bidCount?: BigNumber;
  askCount?: BigNumber;
  spread?: BigNumber;
}

export type Token = NativeToken | AssetToken;

/**
 * Trades are framed in terms of the account you used to initiate DataProvider.
 * That means that a trade object will say which token was your "payment" in
 * the exchange (the token and amount you sent to someone else) and what was
 * "incoming".
 */
export interface Trade {
  id: string;

  paymentToken: Token;
  paymentAmount: BigNumber;
  paymentOfferId?: OfferId;

  incomingToken: Token;
  incomingAccount: Account;
  incomingAmount: BigNumber;
  incomingOfferId?: OfferId;

  timestamp: number;
}

export interface Offer {
  id: OfferId;
  offerer: Account;
  paymentToken: Token;
  incomingToken: Token;
  incomingTokenPrice: BigNumber;
  incomingAmount: BigNumber;
  paymentAmount: BigNumber;
  initialPaymentAmount: BigNumber;
  timestamp: number;

  resultingTrades: TradeId[];
}

export interface Payment {
  id: string;
  isInitialFunding: boolean;
  isRecipient: boolean;
  token: Token;
  amount: BigNumber;
  timestamp: number;
  otherAccount: Account;
  sourceToken?: Token;
  sourceAmount?: BigNumber;
  transactionId: string;
  type: Frontier.OperationResponseType;
  memo?: Memo | string;
  memoType?: MemoType;
  mergedAccount?: Account;
}

export interface Balance {
  token: Token;

  // for non-native tokens, this should be total - sellingLiabilities
  // for native, it should also subtract the minimumBalance
  available: BigNumber;
  total: BigNumber;
  buyingLiabilities: BigNumber;
  sellingLiabilities: BigNumber;
}

export interface AssetBalance extends Balance {
  token: AssetToken;
  sponsor?: string;
}

export interface NativeBalance extends Balance {
  token: NativeToken;
  minimumBalance: BigNumber;
}

export interface BalanceMap {
  [key: string]: AssetBalance | NativeBalance;
  native: NativeBalance;
}
