import { useAtom } from "jotai";
import styled from "styled-components";
import { deleteBlockAtom } from "../../../atoms";

const Container = styled.button`
  padding: 6px 12px;
  border: 1px solid #dc3545;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  color: #dc3545;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #dc3545;
    color: white;
  }
`;

const DeleteButton = () => {
  const [, deleteBlock] = useAtom(deleteBlockAtom);

  return (
    <Container onClick={() => deleteBlock()} title="삭제">
      삭제
    </Container>
  );
};

export default DeleteButton;
