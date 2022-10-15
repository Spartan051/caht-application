import { Message } from "../dtos/dtos";

export default (
  from: string,
  text?: string,
  lat?: string,
  lng?: string
): Message => {
  return {
    from,
    text,
    url: `https://www.google.com/maps?q=${lat},${lng}`,
  };
};
