import { useCallback } from 'react';

import type { TableProps, TableColumnType } from 'antd';
import type { MenuItemType } from 'antd/lib/menu/hooks/useItems';

import { UseQueryResult } from '@tanstack/react-query';

import type {
  PaginationParams as PaginationParamsPromise,
  UsePromisePaginated
} from '@eduzz/ui-hooks-promises/usePromisePaginated';
import type {
  PaginationParams as PaginationParamsQuery,
  UseQueryPaginatedResult
} from '@eduzz/ui-hooks-query/useQueryPaginated';

import generateColumns from './generateColumns';
import generateLocale from './generateLocale';
import generatePagination from './generatePagination';

export type PaginationParams = PaginationParamsPromise & PaginationParamsQuery;

export type UseTableAction<R> = Array<Omit<MenuItemType, 'onClick'> & { onClick: (item: R) => void }>;

export type UseTableProps<R> = {
  minWidth?: number;
  columns?: Array<TableColumnType<R> & { hidden?: boolean }>;
  actions?: UseTableAction<R> | ((item: R) => UseTableAction<R>);
};

export default function useTableProps<P extends PaginationParams, R>(
  data: UseQueryResult<Array<R>> | UseQueryPaginatedResult<P, R> | UsePromisePaginated<P, R>,
  { minWidth, columns, actions }: UseTableProps<R>
): TableProps<R> {
  const queryData = data as Partial<UseQueryResult<Array<R>>>;
  const queryPaginatedData = data as Partial<UseQueryPaginatedResult<P, R>>;
  const promiseData = data as Partial<UsePromisePaginated<P, R>>;

  const isError = queryPaginatedData.isError ?? !!promiseData.error;
  const result = queryPaginatedData.data?.result ?? promiseData.result ?? queryData.data ?? [];
  const total = queryPaginatedData.data?.total ?? promiseData.total;
  const refresh = queryPaginatedData.refetch ?? promiseData.refresh ?? queryData.refetch;
  const isLoading = queryPaginatedData.isFetching ?? promiseData.isLoading;

  const { mergeParams, params } = queryPaginatedData;

  const handleAntdChange = useCallback<NonNullable<TableProps<R>['onChange']>>(
    (pagination, filters, sorter) => {
      const sort = Array.isArray(sorter) ? sorter[0] : sorter;

      mergeParams?.(
        current =>
          ({
            filters,
            page: pagination.current ?? current.page,
            perPage: pagination.pageSize ?? current.perPage,
            sortField: !sort.order ? undefined : sort.field,
            sortDirection: sort.order === 'ascend' ? 'asc' : sort.order === 'descend' ? 'desc' : undefined
          }) as Partial<P>
      );
    },
    [mergeParams]
  );

  return {
    scroll: minWidth ? { x: minWidth } : undefined,
    loading: isLoading,
    rowKey: 'id',
    columns: generateColumns<R>(columns, actions),
    onChange: mergeParams ? handleAntdChange : undefined,
    dataSource: isError ? [] : result,
    showSorterTooltip: true,
    pagination: generatePagination<P>(total, isLoading, params),
    locale: generateLocale(isError, refresh)
  };
}
