import { decrypt, encrypt } from "../helpers/ScryptEncryption";
import {
  DecryptParams,
  EncryptedKey,
  Encrypter,
  EncryptParams,
} from "../types";

const NAME = "ScryptEncrypter";

/**
 * Encrypt keys with scrypt.
 */
export const ScryptEncrypter: Encrypter = {
  name: NAME,
  async encryptKey(params: EncryptParams): Promise<EncryptedKey> {
    const { key, password } = params;
    const { privateKey, path, extra, publicKey, type, ...props } = key;

    const { encryptedPhrase, salt } = await encrypt({
      password,
      phrase: JSON.stringify({ privateKey, path, extra, publicKey, type }),
    });

    return {
      ...props,
      encryptedBlob: encryptedPhrase,
      encrypterName: NAME,
      salt,
    };
  },

  async decryptKey(params: DecryptParams) {
    const { encryptedKey, password } = params;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { encrypterName, salt, encryptedBlob, ...props } = encryptedKey;

    const data = JSON.parse(
      await decrypt({ phrase: encryptedBlob, salt, password })
    );

    return {
      ...props,
      ...data,
    };
  },
};
