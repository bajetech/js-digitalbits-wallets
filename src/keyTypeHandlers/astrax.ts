import astraxApi from "@bajetech/astrax-api";
import { Networks, Transaction, TransactionBuilder } from "xdb-digitalbits-sdk";
import { HandlerSignTransactionParams, KeyTypeHandler } from "../types";
import { KeyType } from "../constants/keys";

export const astraxHandler: KeyTypeHandler = {
  keyType: KeyType.astrax,
  async signTransaction(params: HandlerSignTransactionParams) {
    const { transaction, key, custom } = params;

    if (key.privateKey !== "") {
      throw new Error(
        `Non-astrax key sent to astrax handler: ${JSON.stringify(
          key.publicKey
        )}`
      );
    }

    try {
      const response = await astraxApi.signTransaction(
        transaction.toXDR(),
        custom && custom.network ? custom.network : undefined
      );

      // fromXDR() returns type "Transaction | FeeBumpTransaction" and
      // signTransaction() doesn't like "| FeeBumpTransaction" type, so casting
      // to "Transaction" type.
      return TransactionBuilder.fromXDR(
        response,
        custom && custom.network && custom.network === "TESTNET"
          ? Networks.TESTNET
          : Networks.PUBLIC
      ) as Transaction;
    } catch (error: any) {
      throw new Error(
        `We couldn't sign the transaction with astrax. ${error.toString()}.`
      );
    }
  },
};
