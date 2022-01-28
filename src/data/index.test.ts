import { Asset } from "xdb-digitalbits-sdk";
import {
  getBalanceIdentifier,
  getDigitalBitsSdkAsset,
  getTokenIdentifier,
} from "./";

describe("getTokenIdentifier", () => {
  test("native element", () => {
    expect(getTokenIdentifier({ type: "native", code: "XLM" })).toEqual(
      "native"
    );
  });
  test("non-native element", () => {
    expect(
      getTokenIdentifier({
        code: "BAT",
        type: "credit_alphanum4",
        issuer: {
          key: "GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR",
        },
      })
    ).toEqual("BAT:GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR");
  });
});

describe("getBalanceIdentifier", () => {
  test("native balance", () => {
    expect(
      getBalanceIdentifier({
        asset_type: "native",
        balance: "100",
        buying_liabilities: "foo",
        selling_liabilities: "bar",
      })
    ).toEqual("native");
  });
  test("non-native balance", () => {
    expect(
      getBalanceIdentifier({
        asset_code: "BAT",
        asset_issuer:
          "GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR",
        asset_type: "credit_alphanum4",
        balance: "100",
        buying_liabilities: "foo",
        is_authorized: false,
        is_authorized_to_maintain_liabilities: false,
        last_modified_ledger: 1,
        limit: "foo",
        selling_liabilities: "bar",
      })
    ).toEqual("BAT:GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR");
  });
});

describe("getDigitalBitsSdkAsset", () => {
  test("native element", () => {
    expect(getDigitalBitsSdkAsset({ type: "native", code: "XLM" })).toEqual(
      Asset.native()
    );
  });
  test("normal element", () => {
    expect(
      getDigitalBitsSdkAsset({
        code: "BAT",
        type: "credit_alphanum4",
        issuer: {
          key: "GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR",
        },
      })
    ).toEqual(
      new Asset(
        "BAT",
        "GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR"
      )
    );
  });
});
