import { Button, Empty, Result } from 'antd';

export default function generateLocale(
  error: any,
  refresh: (() => void) | undefined,
  emptyMessage?: string,
  errorFormatter?: (err: any) => string
) {
  return {
    emptyText: error ? (
      <>
        <Result
          status={500}
          title='Um problema aconteceu'
          subTitle={errorFormatter?.(error)}
          extra={
            <Button type='default' onClick={() => refresh?.()}>
              Tentar Novamente
            </Button>
          }
        />
      </>
    ) : (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={emptyMessage} />
    )
  };
}
