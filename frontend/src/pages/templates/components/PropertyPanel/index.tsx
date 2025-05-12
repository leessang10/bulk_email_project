import React from "react";
import styled from "styled-components";
import { DEFAULT_COMPONENT_PROPERTIES } from "../../constants/defaultProperties";
import type {
  ComponentItem,
  ComponentType,
  LayoutItem,
} from "../../types/editor";
import RangeInput from "./RangeInput";

interface PropertyPanelProps {
  selectedItem: ComponentItem | LayoutItem | null;
  onUpdateProperties: (properties: Record<string, any>) => void;
  onUpdateContent?: (content: string) => void;
  onDeleteComponent?: (componentId: string) => void;
  onDeleteLayout?: (layoutId: string) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedItem,
  onUpdateProperties,
  onUpdateContent,
  onDeleteComponent,
  onDeleteLayout,
}) => {
  if (!selectedItem) {
    return (
      <Container>
        <Title>속성</Title>
        <EmptyMessage>편집할 항목을 선택하세요</EmptyMessage>
      </Container>
    );
  }

  const isComponent = "type" in selectedItem && "content" in selectedItem;

  const handleDelete = () => {
    if (isComponent && onDeleteComponent) {
      onDeleteComponent(selectedItem.id);
    } else if (!isComponent && onDeleteLayout) {
      onDeleteLayout(selectedItem.id);
    }
  };

  if (!isComponent) {
    return (
      <Container>
        <Title>레이아웃 속성</Title>
        <Spacer />
        <DeleteButton onClick={handleDelete}>삭제</DeleteButton>
      </Container>
    );
  }

  const componentItem = selectedItem as ComponentItem;
  const defaultProps =
    DEFAULT_COMPONENT_PROPERTIES[componentItem.type].properties;

  const handlePaddingXChange = (value: number) => {
    onUpdateProperties({
      ...componentItem.properties,
      paddingX: `${value}px`,
    });
  };

  const handlePaddingYChange = (value: number) => {
    onUpdateProperties({
      ...componentItem.properties,
      paddingY: `${value}px`,
    });
  };

  const handleBorderRadiusChange = (value: number) => {
    onUpdateProperties({
      ...componentItem.properties,
      borderRadius: `${value}px`,
    });
  };

  const commonControls = (
    <>
      <RangeInput
        label="좌우 패딩"
        value={parseInt(
          (
            componentItem.properties.paddingX ||
            defaultProps.paddingX ||
            "10px"
          ).replace("px", "")
        )}
        min={0}
        max={50}
        unit="px"
        onChange={handlePaddingXChange}
      />
      <RangeInput
        label="상하 패딩"
        value={parseInt(
          (
            componentItem.properties.paddingY ||
            defaultProps.paddingY ||
            "5px"
          ).replace("px", "")
        )}
        min={0}
        max={50}
        unit="px"
        onChange={handlePaddingYChange}
      />
      <RangeInput
        label="테두리 반경"
        value={parseInt(
          (
            componentItem.properties.borderRadius ||
            defaultProps.borderRadius ||
            "0px"
          ).replace("px", "")
        )}
        min={0}
        max={20}
        unit="px"
        onChange={handleBorderRadiusChange}
      />
    </>
  );

  const textStyleControls = (
    <>
      <PropertyGroup>
        <Label>글꼴</Label>
        <Select
          value={
            componentItem.properties.fontFamily ||
            defaultProps.fontFamily ||
            "Arial, sans-serif"
          }
          onChange={(e) =>
            onUpdateProperties({
              ...componentItem.properties,
              fontFamily: e.target.value,
            })
          }
        >
          <option value="Arial, sans-serif">Arial</option>
          <option value="'Noto Sans KR', sans-serif">Noto Sans KR</option>
          <option value="'Malgun Gothic', sans-serif">맑은 고딕</option>
          <option value="'Roboto', sans-serif">Roboto</option>
        </Select>
      </PropertyGroup>
      <PropertyGroup>
        <Label>스타일</Label>
        <StyleButtonGroup>
          <StyleButton
            $active={componentItem.properties.fontWeight === "bold"}
            onClick={() =>
              onUpdateProperties({
                ...componentItem.properties,
                fontWeight:
                  componentItem.properties.fontWeight === "bold"
                    ? "normal"
                    : "bold",
              })
            }
            title="굵게"
          >
            B
          </StyleButton>
          <StyleButton
            $active={componentItem.properties.fontStyle === "italic"}
            onClick={() =>
              onUpdateProperties({
                ...componentItem.properties,
                fontStyle:
                  componentItem.properties.fontStyle === "italic"
                    ? "normal"
                    : "italic",
              })
            }
            title="기울임"
          >
            I
          </StyleButton>
          <StyleButton
            $active={componentItem.properties.textDecoration === "underline"}
            onClick={() =>
              onUpdateProperties({
                ...componentItem.properties,
                textDecoration:
                  componentItem.properties.textDecoration === "underline"
                    ? "none"
                    : "underline",
              })
            }
            title="밑줄"
          >
            U
          </StyleButton>
          <StyleButton
            $active={componentItem.properties.textDecoration === "line-through"}
            onClick={() =>
              onUpdateProperties({
                ...componentItem.properties,
                textDecoration:
                  componentItem.properties.textDecoration === "line-through"
                    ? "none"
                    : "line-through",
              })
            }
            title="취소선"
          >
            S
          </StyleButton>
        </StyleButtonGroup>
      </PropertyGroup>
    </>
  );

  const renderComponentProperties = (type: ComponentType) => {
    switch (type) {
      case "text":
        return (
          <>
            <PropertyGroup>
              <Label>텍스트</Label>
              <TextArea
                value={componentItem.content}
                onChange={(e) => onUpdateContent?.(e.target.value)}
              />
            </PropertyGroup>
            {textStyleControls}
            <PropertyGroup>
              <Label>색상</Label>
              <Input
                type="color"
                value={
                  componentItem.properties.color ||
                  defaultProps.color ||
                  "#333333"
                }
                onChange={(e) =>
                  onUpdateProperties({
                    ...componentItem.properties,
                    color: e.target.value,
                  })
                }
              />
            </PropertyGroup>
            <PropertyGroup>
              <Label>정렬</Label>
              <Select
                value={
                  componentItem.properties.textAlign ||
                  defaultProps.textAlign ||
                  "center"
                }
                onChange={(e) =>
                  onUpdateProperties({
                    ...componentItem.properties,
                    textAlign: e.target.value as "left" | "center" | "right",
                  })
                }
              >
                <option value="left">왼쪽</option>
                <option value="center">가운데</option>
                <option value="right">오른쪽</option>
              </Select>
            </PropertyGroup>
            {commonControls}
          </>
        );

      case "image":
        return (
          <>
            <PropertyGroup>
              <Label>이미지 URL</Label>
              <Input
                type="text"
                value={componentItem.properties.src || defaultProps.src || ""}
                onChange={(e) =>
                  onUpdateProperties({
                    ...componentItem.properties,
                    src: e.target.value,
                  })
                }
              />
            </PropertyGroup>
            <PropertyGroup>
              <Label>대체 텍스트</Label>
              <Input
                type="text"
                value={componentItem.properties.alt || defaultProps.alt || ""}
                onChange={(e) =>
                  onUpdateProperties({
                    ...componentItem.properties,
                    alt: e.target.value,
                  })
                }
              />
            </PropertyGroup>
            <RangeInput
              label="너비"
              value={parseInt(
                (
                  componentItem.properties.width ||
                  defaultProps.width ||
                  "80%"
                ).replace("%", "")
              )}
              min={0}
              max={100}
              unit="%"
              onChange={(value) =>
                onUpdateProperties({
                  ...componentItem.properties,
                  width: `${value}%`,
                })
              }
            />
            {commonControls}
          </>
        );

      case "button":
        return (
          <>
            <PropertyGroup>
              <Label>텍스트</Label>
              <Input
                type="text"
                value={componentItem.content}
                onChange={(e) => onUpdateContent?.(e.target.value)}
              />
            </PropertyGroup>
            <PropertyGroup>
              <Label>링크 URL</Label>
              <Input
                type="text"
                value={
                  componentItem.properties.href || defaultProps.href || "#"
                }
                onChange={(e) =>
                  onUpdateProperties({
                    ...componentItem.properties,
                    href: e.target.value,
                  })
                }
              />
            </PropertyGroup>
            {textStyleControls}
            <PropertyGroup>
              <Label>배경색</Label>
              <Input
                type="color"
                value={
                  componentItem.properties.backgroundColor ||
                  defaultProps.backgroundColor ||
                  "#1a73e8"
                }
                onChange={(e) =>
                  onUpdateProperties({
                    ...componentItem.properties,
                    backgroundColor: e.target.value,
                  })
                }
              />
            </PropertyGroup>
            <PropertyGroup>
              <Label>텍스트 색상</Label>
              <Input
                type="color"
                value={
                  componentItem.properties.color ||
                  defaultProps.color ||
                  "#ffffff"
                }
                onChange={(e) =>
                  onUpdateProperties({
                    ...componentItem.properties,
                    color: e.target.value,
                  })
                }
              />
            </PropertyGroup>
            {commonControls}
          </>
        );

      case "link":
        return (
          <>
            <PropertyGroup>
              <Label>텍스트</Label>
              <Input
                type="text"
                value={componentItem.content}
                onChange={(e) => onUpdateContent?.(e.target.value)}
              />
            </PropertyGroup>
            <PropertyGroup>
              <Label>링크 URL</Label>
              <Input
                type="text"
                value={
                  componentItem.properties.href || defaultProps.href || "#"
                }
                onChange={(e) =>
                  onUpdateProperties({
                    ...componentItem.properties,
                    href: e.target.value,
                  })
                }
              />
            </PropertyGroup>
            {textStyleControls}
            <PropertyGroup>
              <Label>색상</Label>
              <Input
                type="color"
                value={
                  componentItem.properties.color ||
                  defaultProps.color ||
                  "#1a73e8"
                }
                onChange={(e) =>
                  onUpdateProperties({
                    ...componentItem.properties,
                    color: e.target.value,
                  })
                }
              />
            </PropertyGroup>
            {commonControls}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Container>
      <Title>컴포넌트 속성</Title>
      {renderComponentProperties(componentItem.type)}
      <Spacer />
      <DeleteButton onClick={handleDelete}>삭제</DeleteButton>
    </Container>
  );
};

const Container = styled.div`
  background: #ffffff;
  padding: 20px;
  border-right: 1px solid #e0e0e0;
  width: 280px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 18px;
  margin: 0 0 20px 0;
  color: #333;
`;

const Spacer = styled.div`
  flex: 1;
`;

const DeleteButton = styled.button`
  background: #dc3545;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  padding: 12px;
  width: 100%;
  transition: all 0.2s;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(220, 53, 69, 0.2);

  &:hover {
    background: #c82333;
    box-shadow: 0 2px 6px rgba(220, 53, 69, 0.4);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: none;
  }
`;

const EmptyMessage = styled.p`
  color: #666;
  text-align: center;
  margin-top: 32px;
`;

const PropertyGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;

  &[type="color"] {
    height: 40px;
    padding: 4px;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  min-height: 100px;
  resize: vertical;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: white;
`;

const StyleButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const StyleButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: ${({ $active }) => ($active ? "#1a73e8" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#333")};
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: ${({ $active }) => ($active ? "#1557b0" : "#f5f5f5")};
  }
`;

export default PropertyPanel;
