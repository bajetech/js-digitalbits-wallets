import BigNumber from "bignumber.js";
import { Asset, AssetType, ServerApi } from "xdb-digitalbits-sdk";
import { NATIVE_ASSET_IDENTIFIER } from "../constants/digitalbits";
import { Account, Token, Trade } from "../types";

export function makeDisplayableTrades(
  subjectAccount: Account,
  trades: ServerApi.TradeRecord[]
): Trade[] {
  // make a map of trades to their original offerids
  return trades.map((trade: ServerApi.TradeRecord): Trade => {
    const base = {
      publicKey: trade.base_account || "",
    };

    const counter = {
      publicKey: trade.counter_account || "",
    };

    const isSubjectBase: boolean = base.publicKey === subjectAccount.publicKey;

    const baseToken: Token = {
      type: trade.base_asset_type as AssetType,
      code: (trade.base_asset_code as string) || Asset.native().getCode(),
      issuer:
        trade.base_asset_type === NATIVE_ASSET_IDENTIFIER
          ? undefined
          : {
              key: trade.base_asset_issuer as string,
            },
    };

    const counterToken: Token = {
      type: trade.counter_asset_type as AssetType,
      code: (trade.counter_asset_code as string) || Asset.native().getCode(),
      issuer:
        trade.counter_asset_type === NATIVE_ASSET_IDENTIFIER
          ? undefined
          : {
              key: trade.counter_asset_issuer as string,
            },
    };

    let paymentOfferId;
    let incomingOfferId;

    if ("base_offer_id" in trade) {
      paymentOfferId = isSubjectBase
        ? trade.base_offer_id
        : trade.counter_offer_id;

      incomingOfferId = isSubjectBase
        ? trade.counter_offer_id
        : trade.base_offer_id;
    }

    return {
      id: trade.id,
      timestamp: Math.floor(new Date(trade.ledger_close_time).getTime() / 1000),

      paymentToken: isSubjectBase ? baseToken : counterToken,
      paymentAmount: isSubjectBase
        ? new BigNumber(trade.base_amount)
        : new BigNumber(trade.counter_amount),
      paymentOfferId,

      incomingToken: isSubjectBase ? counterToken : baseToken,
      incomingAmount: isSubjectBase
        ? new BigNumber(trade.counter_amount)
        : new BigNumber(trade.base_amount),
      incomingAccount: isSubjectBase ? counter : base,
      incomingOfferId,
    };
  });
}
