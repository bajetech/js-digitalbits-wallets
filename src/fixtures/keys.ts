import DigitalBitsSdk from "xdb-digitalbits-sdk";
import { EncryptedKey, Key, KeyMetadata } from "../types";
import { KeyType } from "../constants/keys";

export function generatePlaintextKey(): Key {
  const account = DigitalBitsSdk.Keypair.random();
  const publicKey = account.publicKey();
  const privateKey = account.secret();

  return {
    id: `${Math.random()}`,
    type: KeyType.plaintextKey,
    publicKey,
    privateKey,
  };
}

export function generateEncryptedKey(encrypterName: string): EncryptedKey {
  const { privateKey, ...key } = generatePlaintextKey();

  return {
    ...key,
    encrypterName,
    salt: "",
    encryptedBlob: `${privateKey}password`,
  };
}

export function generateKeyMetadata(encrypterName: string): KeyMetadata {
  const { id } = generateEncryptedKey(encrypterName);

  return {
    id,
  };
}
