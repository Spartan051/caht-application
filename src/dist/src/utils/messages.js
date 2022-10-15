export default (from, text, lat, lng) => {
    return {
        from,
        text,
        url: `https://www.google.com/maps?q=${lat},${lng}`,
    };
};
