import BigNumber from "bignumber.js";
import { Asset, AssetType, ServerApi } from "xdb-digitalbits-sdk";
import { makeDisplayableTrades } from "./makeDisplayableTrades";
import { Account, Offer, Token, Trade } from "../types";
import { NATIVE_ASSET_IDENTIFIER } from "../constants/digitalbits";

export type TradeCollection = ServerApi.TradeRecord[];

export interface DisplayableOffersParams {
  offers: ServerApi.OfferRecord[];
  tradeResponses: TradeCollection[];
}

interface OfferIdMap {
  [offerid: string]: Trade[];
}

export function makeDisplayableOffers(
  subjectAccount: Account,
  params: DisplayableOffersParams
): Offer[] {
  const { offers, tradeResponses } = params;
  const trades = tradeResponses.flat();

  // make a map of offerids to the trades involved with them
  // (reminder that each trade has two offerids, one for each side)
  const offeridsToTradesMap: OfferIdMap = makeDisplayableTrades(
    subjectAccount,
    trades
  ).reduce((memo: any, trade: Trade) => {
    if (trade.paymentOfferId) {
      memo[trade.paymentOfferId] = [
        ...(memo[trade.paymentOfferId] || []),
        trade,
      ];
    }

    return memo;
  }, {});

  return offers.map((offer: ServerApi.OfferRecord): Offer => {
    const { id, selling, seller, buying, amount, price_r, last_modified_time } =
      offer;

    const paymentToken: Token = {
      type: selling.asset_type as AssetType,
      code: (selling.asset_code as string) || Asset.native().getCode(),
      issuer:
        selling.asset_type === NATIVE_ASSET_IDENTIFIER
          ? undefined
          : {
              key: selling.asset_issuer as string,
            },
    };

    const incomingToken: Token = {
      type: buying.asset_type as AssetType,
      code: (buying.asset_code as string) || Asset.native().getCode(),
      issuer:
        buying.asset_type === NATIVE_ASSET_IDENTIFIER
          ? undefined
          : {
              key: buying.asset_issuer as string,
            },
    };

    const tradePaymentAmount: BigNumber = (
      offeridsToTradesMap[id] || []
    ).reduce((memo: BigNumber, trade: Trade): BigNumber => {
      return memo.plus(trade.paymentAmount);
    }, new BigNumber(0));

    return {
      id: `${id}`,
      offerer: {
        publicKey: seller as string,
      },
      timestamp: Math.floor(new Date(last_modified_time).getTime() / 1000),
      paymentToken,
      paymentAmount: new BigNumber(amount),
      initialPaymentAmount: new BigNumber(amount).plus(tradePaymentAmount),
      incomingToken,
      incomingAmount: new BigNumber(price_r.n).div(price_r.d).times(amount),
      incomingTokenPrice: new BigNumber(1).div(price_r.n).times(price_r.d),
      resultingTrades: (offeridsToTradesMap[id] || []).map(trade => trade.id),
    };
  });
}
