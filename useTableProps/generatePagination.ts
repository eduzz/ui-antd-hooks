import type { TablePaginationConfig } from 'antd';

import type { PaginationParams } from '.';
import { formatNumber } from '../utils/formatter';

export default function generatePagination<P extends PaginationParams>(
  total: number | undefined,
  isLoading: boolean | undefined,
  params: P | undefined
): TablePaginationConfig | false {
  if (total === undefined || total === null) return false;

  return {
    disabled: isLoading,
    responsive: true,
    pageSize: params?.perPage,
    current: params?.page,
    showSizeChanger: true,
    showTotal: (total, range) => `${formatNumber(range[0])}-${formatNumber(range[1])} of ${formatNumber(total)} items`,
    total
  };
}
