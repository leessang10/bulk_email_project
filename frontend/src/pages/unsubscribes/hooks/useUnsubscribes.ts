import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import type {
  TableParams,
  TableState,
} from "../../../common/components/TableV2/types";
import { getUnsubscribeList } from "../api";

type TableAtoms = ReturnType<
  typeof import("../../../common/components/TableV2/atoms").createTableAtom
>;

export const useUnsubscribes = (atoms: TableAtoms) => {
  const queryClient = useQueryClient();
  const [currentPage] = useAtom(atoms.currentPageAtom);
  const [perPage] = useAtom(atoms.perPageAtom);
  const [sort] = useAtom(atoms.sortAtom);
  const [searchQuery] = useAtom(atoms.searchQueryAtom);
  const [filters] = useAtom(atoms.filtersAtom);

  const { data, isLoading } = useQuery({
    queryKey: [
      "unsubscribes",
      { currentPage, perPage, sort, searchQuery, filters },
    ],
    queryFn: () =>
      getUnsubscribeList({
        page: currentPage,
        pageSize: perPage,
        sortBy: sort.sortKey as "email" | "createdAt",
        sortOrder: sort.sortDirection.toUpperCase() as "ASC" | "DESC",
        email: searchQuery,
      }),
  });

  const handleDataRequest = (params: TableParams) => {
    const newState: TableState = {
      currentPage: params.page,
      perPage: params.perPage,
      sort: {
        sortKey: params.sortKey,
        sortDirection: params.sortDirection,
      },
      searchQuery: params.searchQuery,
      filters: params.filters,
      isDetailDrawerOpen: false,
      isCreateDrawerOpen: false,
      selectedRow: null,
    };

    queryClient.invalidateQueries({
      queryKey: ["unsubscribes", newState],
    });
  };

  return {
    data: data?.items ?? [],
    totalItems: data?.total ?? 0,
    isLoading,
    handleDataRequest,
  };
};
