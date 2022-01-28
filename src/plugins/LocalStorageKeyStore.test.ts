import os from "os";
import path from "path";
import sinon from "sinon";
import { LocalStorage } from "node-localstorage";
import { testKeyStore } from "../PluginTesting";
import { LocalStorageKeyStore } from "./LocalStorageKeyStore";
import { EncryptedKey } from "../types";

// tslint:disable-next-line
describe("LocalStorageKeyStore", function () {
  let clock: sinon.SinonFakeTimers;
  let testStore: LocalStorageKeyStore;
  let localStorage: Storage;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    testStore = new LocalStorageKeyStore();
    localStorage = new LocalStorage(
      path.resolve(os.tmpdir(), "js-digitalbits-wallets")
    );
    testStore.configure({ storage: localStorage });
  });

  afterEach(() => {
    clock.restore();
    localStorage.clear();
  });

  it("properly stores keys", async () => {
    const encryptedKey: EncryptedKey = {
      id: "PURIFIER",
      encryptedBlob: "BLOB",
      encrypterName: "Test",
      salt: "SLFKJSDLKFJLSKDJFLKSJD",
    };

    const keyMetadata = {
      id: "PURIFIER",
    };

    const testMetadata = await testStore.storeKeys([encryptedKey]);
    expect(testMetadata).toEqual([keyMetadata]);

    const allKeys = await testStore.loadAllKeys();
    expect(allKeys).toEqual([{ ...encryptedKey, ...keyMetadata }]);
  });

  it("properly deletes keys", async () => {
    const encryptedKey: EncryptedKey = {
      id: "PURIFIER",
      encrypterName: "Test",
      encryptedBlob: "BLOB",
      salt: "SLFKJSDLKFJLSKDJFLKSJD",
    };

    const keyMetadata = {
      id: "PURIFIER",
    };

    await testStore.storeKeys([encryptedKey]);

    const allKeys = await testStore.loadAllKeys();
    expect(allKeys).toEqual([{ ...encryptedKey, ...keyMetadata }]);

    const removalMetadata = await testStore.removeKey("PURIFIER");
    expect(removalMetadata).toEqual(keyMetadata);

    const noKeys = await testStore.loadAllKeys();
    expect(noKeys).toEqual([]);
  });

  it("passes PluginTesting", done => {
    testKeyStore(testStore)
      .then(() => {
        done();
      })
      .catch(done);
  });
});
