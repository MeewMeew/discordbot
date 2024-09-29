export const matchMedia = (string: string) => {
  const allUrl = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.([a-z]{2,6})\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/ig;
  const tiktok = /^.*https:\/\/(?:m|www|vm|vt)?\.?tiktok\.com\/((?:.*\b(?:(?:usr|v|embed|user|video|photo)\/|\?shareId=|\&item_id=)(\d+))|\w+)/ig;

  const all = allUrl.exec(string);
  const tt = tiktok.exec(string);

  if (tt) return { platform: "tiktok", id: tt[0] };
  if (all) return { platform: "multiple", id: all[0] };
  return null;
};
