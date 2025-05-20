import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import type {
  TableParams,
  TableState,
} from "../../../common/components/TableV2/types";
import { emailTemplatesApi } from "../api/templates";
import type { EmailTemplate } from "../api/types";

type TableAtoms = ReturnType<
  typeof import("../../../common/components/TableV2/atoms").createTableAtom
>;

export const useEmailTemplates = (atoms: TableAtoms) => {
  const [currentPage] = useAtom(atoms.currentPageAtom);
  const [perPage] = useAtom(atoms.perPageAtom);
  const [sort] = useAtom(atoms.sortAtom);
  const [searchQuery] = useAtom(atoms.searchQueryAtom);
  const [filters] = useAtom(atoms.filtersAtom);

  const { data, isLoading } = useQuery({
    queryKey: [
      "email-templates",
      { currentPage, perPage, sort, searchQuery, filters },
    ],
    queryFn: () =>
      emailTemplatesApi.getList({
        page: currentPage,
        pageSize: perPage,
        sortBy: sort.sortKey as "createdAt",
        sortOrder: sort.sortDirection as "asc" | "desc",
        isActive: true,
      }),
  });

  const handleDataRequest = (params: TableParams) => {
    const newState: TableState<EmailTemplate> = {
      currentPage: params.page,
      perPage: params.perPage,
      sort: {
        sortKey: params.sortKey as "createdAt",
        sortDirection: params.sortDirection as "asc" | "desc",
      },
      searchQuery: params.searchQuery,
      filters: params.filters,
    };
  };

  return {
    data: data?.items ?? [],
    totalItems: data?.total ?? 0,
    isLoading,
    handleDataRequest,
  };
};
