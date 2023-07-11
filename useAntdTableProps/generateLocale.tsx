import { Button, Empty, Result } from 'antd';

export default function generateLocale(isError: boolean, refresh: (() => void) | undefined) {
  return {
    emptyText: isError ? (
      <>
        <Result
          status={500}
          title='Um problema aconteceu'
          extra={
            <Button type='default' onClick={() => refresh?.()}>
              Tentar Novamente
            </Button>
          }
        />
      </>
    ) : (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    )
  };
}
