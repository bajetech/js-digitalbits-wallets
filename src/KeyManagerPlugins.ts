import { IdentityEncrypter } from "./plugins/IdentityEncrypter";
import { LocalStorageKeyStore } from "./plugins/LocalStorageKeyStore";
import { MemoryKeyStore } from "./plugins/MemoryKeyStore";
import { ScryptEncrypter } from "./plugins/ScryptEncrypter";

export const KeyManagerPlugins = {
  IdentityEncrypter,
  MemoryKeyStore,
  LocalStorageKeyStore,
  ScryptEncrypter,
};
