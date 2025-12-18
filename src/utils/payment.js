export function makeSwishLink(number, amount = null, message = null, editable = null) {
  if (!number) return '';

  // Swish QR specification expects the number without leading '+'
  const normalizedNumber = number.startsWith('+') ? number.slice(1) : number;

  const params = new URLSearchParams();
  params.set('sw', normalizedNumber);

  if (amount != null) {
    const numericAmount = Number(amount);
    if (!Number.isNaN(numericAmount) && numericAmount > 0) {
      // Ensure dot as decimal separator
      params.set('amt', numericAmount.toString());
    }
  }

  if (message != null && message.trim() !== '') {
    params.set('msg', message.trim());
  }

  if (editable && Array.isArray(editable) && editable.length > 0) {
    // Allowed values: 'amt', 'msg', 'amt,msg' (lowercase, comma separated)
    const validFields = editable.filter((field) => field === 'amt' || field === 'msg');
    if (validFields.length > 0) {
      params.set('edit', validFields.join(','));
    }
  }

  return `https://app.swish.nu/1/p/sw/?${params.toString()}`;
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

