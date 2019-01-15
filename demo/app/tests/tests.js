var Dropbox = require("nativescript-dropbox").Dropbox;

describe("init function", function () {
    it("exists", function () {
        expect(Dropbox.init).toBeDefined();
    });
});