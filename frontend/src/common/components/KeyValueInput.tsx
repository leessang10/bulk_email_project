import { useState } from "react";
import styled from "styled-components";

interface KeyValuePair {
  key: string;
  value: string;
}

interface KeyValueInputProps {
  onChange: (pairs: KeyValuePair[]) => void;
  maxPairs?: number;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PairContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  flex: 1;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  padding: 8px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #b91c1c;
  }
`;

const AddButton = styled.button`
  background-color: #f8fafc;
  border: 1px dashed #e2e8f0;
  border-radius: 6px;
  padding: 8px 12px;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s;

  &:hover {
    background-color: #f1f5f9;
    border-color: #4a90e2;
    color: #4a90e2;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const KeyValueInput = ({ onChange, maxPairs = 5 }: KeyValueInputProps) => {
  const [pairs, setPairs] = useState<KeyValuePair[]>([{ key: "", value: "" }]);

  const handlePairChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newPairs = [...pairs];
    newPairs[index] = { ...newPairs[index], [field]: value };
    setPairs(newPairs);
    onChange(newPairs);
  };

  const handleAddPair = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pairs.length < maxPairs) {
      const newPairs = [...pairs, { key: "", value: "" }];
      setPairs(newPairs);
      onChange(newPairs);
    }
  };

  const handleRemovePair = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    const newPairs = pairs.filter((_, i) => i !== index);
    setPairs(newPairs);
    onChange(newPairs);
  };

  return (
    <Container>
      {pairs.map((pair, index) => (
        <PairContainer key={index}>
          <Input
            placeholder="키"
            value={pair.key}
            onChange={(e) => handlePairChange(index, "key", e.target.value)}
          />
          <Input
            placeholder="값"
            value={pair.value}
            onChange={(e) => handlePairChange(index, "value", e.target.value)}
          />
          {pairs.length > 1 && (
            <RemoveButton onClick={(e) => handleRemovePair(e, index)}>
              ✕
            </RemoveButton>
          )}
        </PairContainer>
      ))}
      {pairs.length < maxPairs && (
        <AddButton type="button" onClick={handleAddPair}>
          + 항목 추가하기
        </AddButton>
      )}
    </Container>
  );
};

export default KeyValueInput;
