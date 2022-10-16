"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (from, text, lat, lng) => {
    return {
        from,
        text,
        url: `https://www.google.com/maps?q=${lat},${lng}`,
    };
};
