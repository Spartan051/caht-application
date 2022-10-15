import expect from "expect";
import createMessage from "./messages";

describe("create message", () => {
  it("should create correct message object"),
    () => {
      const from = "anyone";
      const text = "test text";
      const message = createMessage(from, text);

      expect(message).toMatchObject({ from, text });
    };
});
