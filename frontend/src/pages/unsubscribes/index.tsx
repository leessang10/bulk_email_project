import { useMemo } from "react";
import PageLayout from "../../common/components/PageLayout";
import TableV2 from "../../common/components/TableV2";
import { createTableAtom } from "../../common/components/TableV2/atoms";
import { COLUMNS, SORT_OPTIONS } from "./constants";
import { useUnsubscribes } from "./hooks/useUnsubscribes";
import type { Unsubscribe } from "./types";

const UnsubscribesPage = () => {
  const atoms = useMemo(() => createTableAtom("unsubscribes"), []);

  const { data, totalItems, isLoading, handleDataRequest } =
    useUnsubscribes(atoms);

  return (
    <PageLayout
      title="수신거부 이메일 관리"
      description="수신거부된 이메일 주소와 사유를 관리할 수 있습니다."
    >
      <TableV2<Unsubscribe>
        tableId="unsubscribes"
        columns={COLUMNS}
        data={data}
        totalItems={totalItems}
        sortOptions={SORT_OPTIONS}
        onDataRequest={handleDataRequest}
      />
    </PageLayout>
  );
};

export default UnsubscribesPage;
