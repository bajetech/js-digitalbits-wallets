import { Transaction } from "xdb-digitalbits-sdk";
import { KeyType } from "../constants/keys";

export interface BaseKey {
  extra?: any;
  path?: string;
  publicKey: string;
  // if the network is not set, the key is assumed to be on Networks.PUBLIC
  network?: string;
  type: KeyType | string;
}

/**
 * All key types (astrax, plaintext keys, etc.) should use the same Key shape.
 * That way, plugins don't have to know what key type there is, they just work
 * the same on all of them.
 *
 * `privateKey` is always required regardless of key types. If the key type
 * doesn't have any secrets (which is currently not yet the case), this
 * should be an empty string.
 *
 * `extra` is an arbitrary store of additional metadata, to be used as an escape
 * hatch to support any exotic key type in the future.
 */
export interface Key extends BaseKey {
  id: string;
  privateKey: string;
}

export interface UnstoredKey extends BaseKey {
  id?: string;
  privateKey: string;
}

/**
 * The encrypted key is the exact same shape as the key, minus secret
 * information and plus encrypted information.
 */
export interface EncryptedKey {
  encryptedBlob: string;
  encrypterName: string;
  id: string;
  salt: string;
}

/**
 * Metadata about the key and when it was changed.
 */
export interface KeyMetadata {
  id: string;
}

export interface EncryptParams {
  key: Key;
  password: string;
}

export interface DecryptParams {
  encryptedKey: EncryptedKey;
  password: string;
}

export interface HandlerSignTransactionParams {
  transaction: Transaction;
  key: Key;
  custom?: {
    [key: string]: any;
  };
}

/**
 * This is the export interface that a key type plugin must implement.
 *
 * types of keys:
 *   - plaintext secret key (S...)
 *   - astrax
 */
export interface KeyTypeHandler {
  keyType: KeyType;
  signTransaction(params: HandlerSignTransactionParams): Promise<Transaction>;
}
