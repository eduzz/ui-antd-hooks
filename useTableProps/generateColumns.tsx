import { ReactNode } from 'react';

import { EllipsisOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Dropdown, TableColumnType, Tooltip } from 'antd';
import { MenuItemType } from 'antd/lib/menu/hooks/useItems';

import type { UseTableProps } from '.';

export default function generateColumns<R>(
  columns: Array<TableColumnType<R> & { hidden?: boolean }> | undefined,
  actions: UseTableProps<R>['actions'],
  actionTitle: ReactNode | undefined | null,
  actionRefresh: (() => void) | undefined | null
) {
  return [
    ...(columns ?? []).filter(c => !c.hidden),
    ...(actions
      ? ([
          {
            title: actionRefresh ? (
              <div className='houston-table-action-refresh'>
                <Tooltip title='Atualizar' trigger={['hover']} placement='bottomRight'>
                  <Button icon={<ReloadOutlined />} type='text' shape='circle' onClick={actionRefresh} />
                </Tooltip>
              </div>
            ) : (
              actionTitle ?? 'Ações'
            ),
            width: 80,
            fixed: 'right' as const,
            className: 'houston-table-action',
            render: (_: any, item: R) => {
              const items = Array.isArray(actions) ? actions : actions(item);

              if (items.length === 1) {
                return (
                  <Tooltip
                    title={items[0].label}
                    trigger={['hover']}
                    placement='bottomRight'
                    open={items[0].disabled ? false : undefined}
                  >
                    <Button
                      icon={items[0].icon}
                      shape='circle'
                      type='text'
                      onClick={() => items[0].onClick(item)}
                      disabled={items[0].disabled}
                    />
                  </Tooltip>
                );
              }

              return (
                <Dropdown
                  placement='bottomRight'
                  menu={{ items: items.map(a => ({ ...a, onClick: () => a.onClick(item) }) as MenuItemType) }}
                  trigger={['click']}
                >
                  <Button shape='circle' type='text' icon={<EllipsisOutlined />} />
                </Dropdown>
              );
            }
          }
        ] as TableColumnType<any>[])
      : [])
  ];
}
