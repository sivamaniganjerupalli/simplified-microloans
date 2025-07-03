// src/utils/formatters.js

export function formatEth(amountInWei) {
  const eth = parseFloat(amountInWei) / 10 ** 18;
  return `${eth.toFixed(4)} ETH`;
}

export function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
