export function makeSwishLink(number) {
  return `swish:${number}`;
}

export function makePaypalLink(userPath, amount = null) {
  let url = `https://www.paypal.me/${userPath}`;
  if (amount) {
    url += `${amount}SEK`;
  }
  return url;
}

export function generateQRCodeURL(data, size = 150) {
  return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data)}&size=${size}x${size}`;
}

