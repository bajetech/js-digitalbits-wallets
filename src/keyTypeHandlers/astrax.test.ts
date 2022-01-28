import sinon from "sinon";
import astraxApi from "@bajetech/astrax-api";
import { TransactionBuilder } from "xdb-digitalbits-sdk";
import { astraxHandler } from "./astrax";

describe("astraxHandler", () => {
  const XDR = "foo";
  const NETWORK = "baz";
  const SIGNED_TRANSACTION = "xxx";

  let astraxApiMock: sinon.SinonMock;
  let TransactionBuilderMock: sinon.SinonMock;

  beforeEach(() => {
    astraxApiMock = sinon.mock(astraxApi);
    TransactionBuilderMock = sinon.mock(TransactionBuilder);
  });

  afterEach(() => {
    astraxApiMock.verify();
    astraxApiMock.restore();
    TransactionBuilderMock.verify();
    TransactionBuilderMock.restore();
  });

  test("signTransaction is called with network", () => {
    astraxApiMock
      .expects("signTransaction")
      .once()
      .withArgs(XDR, NETWORK)
      .returns(Promise.resolve(SIGNED_TRANSACTION));
    TransactionBuilderMock.expects("fromXDR")
      .once()
      .withArgs(SIGNED_TRANSACTION)
      .returns(true);

    astraxHandler.signTransaction({
      // @ts-ignore
      transaction: { toXDR: () => XDR },
      // @ts-ignore
      key: { privateKey: "" },
      custom: { network: NETWORK },
    });
  });

  test("signTransaction is called without network", () => {
    astraxApiMock
      .expects("signTransaction")
      .once()
      .withArgs(XDR, undefined)
      .returns(Promise.resolve(SIGNED_TRANSACTION));
    TransactionBuilderMock.expects("fromXDR").once().returns(true);

    astraxHandler.signTransaction({
      // @ts-ignore
      transaction: { toXDR: () => XDR },
      // @ts-ignore
      key: { privateKey: "" },
    });
  });

  test("falsy config is passed as undefined to signTransaction", () => {
    astraxApiMock
      .expects("signTransaction")
      .once()
      .withArgs(XDR, undefined)
      .returns(Promise.resolve(SIGNED_TRANSACTION));
    TransactionBuilderMock.expects("fromXDR")
      .once()
      .withArgs(SIGNED_TRANSACTION)
      .returns(true);

    astraxHandler.signTransaction({
      // @ts-ignore
      transaction: { toXDR: () => XDR },
      // @ts-ignore
      key: { privateKey: "" },
      // @ts-ignore
      custom: false,
    });
  });
});
