import styled from "styled-components";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export const Button = styled.button<ButtonProps>`
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  background-color: ${({ variant = "primary" }) => {
    switch (variant) {
      case "secondary":
        return "#6c757d";
      case "danger":
        return "#dc3545";
      default:
        return "#4a90e2";
    }
  }};
  color: white;

  &:hover {
    background-color: ${({ variant = "primary" }) => {
      switch (variant) {
        case "secondary":
          return "#5a6268";
        case "danger":
          return "#c82333";
        default:
          return "#357abd";
      }
    }};
  }

  &:active {
    background-color: ${({ variant = "primary" }) => {
      switch (variant) {
        case "secondary":
          return "#545b62";
        case "danger":
          return "#bd2130";
        default:
          return "#2d6da3";
      }
    }};
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;
