export const createMessage = (from, text) => {
    return { from: from, text: text, date: new Date().getTime() };
};
