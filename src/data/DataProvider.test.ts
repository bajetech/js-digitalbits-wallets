import { Networks } from "xdb-digitalbits-sdk";
import { generatePlaintextKey } from "../fixtures/keys";
import { DataProvider } from "./DataProvider";

describe("Account validation", () => {
  test("works with null values", () => {
    try {
      const provider = new DataProvider({
        // @ts-ignore
        accountOrKey: null,
        serverUrl: "https://frontier.livenet.digitalbits.io",
        networkPassphrase: Networks.PUBLIC,
      });
      expect(provider).not.toBeInstanceOf(DataProvider);
    } catch (e) {
      expect(e).toBeTruthy();
      expect((e as Error).toString()).toBe("Error: No account key provided.");
    }
  });

  test("works with real public keys", () => {
    try {
      const provider = new DataProvider({
        accountOrKey:
          "GDZBHQFIHLVDF6GCRV5DT2STB6ZXAJR3JFGZNXNPLB35TH5GNMUVIAQP",
        serverUrl: "https://frontier.livenet.digitalbits.io",
        networkPassphrase: Networks.PUBLIC,
      });
      expect(provider).toBeInstanceOf(DataProvider);
    } catch (e) {
      expect(e).toBeUndefined();
    }
  });

  test("works with real typed Keys", () => {
    try {
      const provider = new DataProvider({
        accountOrKey: generatePlaintextKey(),
        serverUrl: "https://frontier.livenet.digitalbits.io",
        networkPassphrase: Networks.PUBLIC,
      });
      expect(provider).toBeInstanceOf(DataProvider);
    } catch (e) {
      expect(e).toBeUndefined();
    }
  });

  test("Throw with bad key", () => {
    let provider;
    try {
      provider = new DataProvider({
        accountOrKey: "I am not a stupid key you dumbdumb",
        serverUrl: "https://frontier.livenet.digitalbits.io",
        networkPassphrase: Networks.PUBLIC,
      });
    } catch (e) {
      expect(e).toBeTruthy();
    }
    expect(provider).not.toBeInstanceOf(DataProvider);
  });
});
