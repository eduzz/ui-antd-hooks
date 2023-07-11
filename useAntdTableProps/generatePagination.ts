import type { PaginationParams } from '.';

export default function generatePagination<P extends PaginationParams>(
  total: number | undefined,
  isLoading: boolean | undefined,
  params: P | undefined
) {
  if (total === undefined || total === null) return false;

  return {
    disabled: isLoading,
    responsive: true,
    pageSize: params?.perPage,
    current: params?.page,
    showSizeChanger: true,
    total
  };
}
