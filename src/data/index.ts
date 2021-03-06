import { Asset, Frontier } from "xdb-digitalbits-sdk";
import { NATIVE_ASSET_IDENTIFIER } from "../constants/digitalbits";
import { AssetToken, Token } from "../types";

/**
 * Get the string identifier for a token.
 * @returns "native" if the token is native, otherwise returns
 * `${tokenCode}:${issuerKey}`.
 */
export function getTokenIdentifier(token: Token): string {
  if (token.type === NATIVE_ASSET_IDENTIFIER) {
    return NATIVE_ASSET_IDENTIFIER;
  }

  return `${token.code}:${(token as AssetToken).issuer.key}`;
}

/**
 * Get the string identifier for a balance line item from Frontier. The response
 * should be the same as if that balance was a Token object, and you passed it
 * through `getTokenIdentifier`
 * @returns Returns `${tokenCode}:${issuerKey}`.
 */
export function getBalanceIdentifier(balance: Frontier.BalanceLine): string {
  if ("asset_issuer" in balance && !balance.asset_issuer) {
    return NATIVE_ASSET_IDENTIFIER;
  }
  switch (balance.asset_type) {
    case "credit_alphanum4":
    case "credit_alphanum12":
      return `${balance.asset_code}:${balance.asset_issuer}`;
    default:
      return NATIVE_ASSET_IDENTIFIER;
  }
}

/**
 * Convert a Wallet-SDK-formatted Token object to a DigitalBits SDK Asset object.
 * @returns Returns `${tokenCode}:${issuerKey}`.
 */
export function getDigitalBitsSdkAsset(token: Token): Asset {
  if (token.type === NATIVE_ASSET_IDENTIFIER) {
    return Asset.native();
  }

  return new Asset(token.code, (token as AssetToken).issuer.key);
}
