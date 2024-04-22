import type { FormatOptionType } from '../constants/constants';

import { ERROR_MESSAGE, FORMAT_OPTION } from '../constants/constants.ts';

export default function formatTimestamp(timestamp: number, format: FormatOptionType): string {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  let formattedDate: string;

  if (format === FORMAT_OPTION.DATE) {
    formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  } else if (format === FORMAT_OPTION.TIME) {
    formattedDate = `${hours}:${minutes}`;
  } else {
    throw new Error(ERROR_MESSAGE.WRONG_FORMAT_TYPE);
  }

  return formattedDate;
}
