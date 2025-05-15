import styled from "styled-components";
import type { EmailGroupStatus } from "../api/types";

export const StatusBadge = styled.span<{ status: EmailGroupStatus }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;

  ${({ status }) => {
    switch (status) {
      case "PENDING":
        return `
          background-color: #f1f5f9;
          color: #475569;
        `;
      case "WAITING":
        return `
          background-color: #fef9c3;
          color: #854d0e;
        `;
      case "PROCESSING":
        return `
          background-color: #e0f2fe;
          color: #0369a1;
        `;
      case "COMPLETED":
        return `
          background-color: #dcfce7;
          color: #15803d;
        `;
      case "FAILED":
        return `
          background-color: #fee2e2;
          color: #b91c1c;
        `;
    }
  }}
`;
