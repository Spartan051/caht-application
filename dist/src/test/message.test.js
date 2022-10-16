import createMessage from "./../utils/message";
describe("create message", () => {
    it("should return object of text message", () => {
        const message = createMessage("user", "text message");
        expect(message).toHaveProperty("from", "user");
        expect(message).toHaveProperty("text", "text message");
    });
    it("should return object of location message", () => {
        const message = createMessage("user", "lat cords", "lng cords");
        expect(message).toHaveProperty("from", "user");
        expect(message).toHaveProperty("url", "https://www.google.com/maps?q=lat cords,lng cords");
    });
});
