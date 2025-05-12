import React from "react";
import styled from "styled-components";
import { DEFAULT_COMPONENT_PROPERTIES } from "../../constants/defaultProperties";
import type {
  ComponentItem,
  ComponentType,
  LayoutItem,
} from "../../types/editor";
import RangeInput from "./RangeInput";
import TextStyleControls from "./TextStyleControls";

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

  const handlePaddingChange = (value: number) => {
    onUpdateProperties({
      ...componentItem.properties,
      padding: `${value}px`,
    });
  };

  const handleHeightChange = (value: number) => {
    onUpdateProperties({
      ...componentItem.properties,
      height: `${value}px`,
    });
  };

  const renderComponentProperties = (type: ComponentType) => {
    const commonControls = (
      <>
        <RangeInput
          label="패딩"
          value={parseInt(
            componentItem.properties.padding || defaultProps.padding
          )}
          min={0}
          max={100}
          onChange={handlePaddingChange}
        />
        <RangeInput
          label="높이"
          value={parseInt(
            componentItem.properties.height || defaultProps.height
          )}
          min={0}
          max={500}
          onChange={handleHeightChange}
        />
      </>
    );

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
            <TextStyleControls
              fontFamily={
                componentItem.properties.fontFamily || defaultProps.fontFamily
              }
              isBold={componentItem.properties.fontWeight === "bold"}
              isItalic={componentItem.properties.fontStyle === "italic"}
              isUnderline={
                componentItem.properties.textDecoration === "underline"
              }
              isStrikethrough={
                componentItem.properties.textDecoration === "line-through"
              }
              onFontFamilyChange={(value) =>
                onUpdateProperties({
                  ...componentItem.properties,
                  fontFamily: value,
                })
              }
              onBoldChange={(value) =>
                onUpdateProperties({
                  ...componentItem.properties,
                  fontWeight: value ? "bold" : "normal",
                })
              }
              onItalicChange={(value) =>
                onUpdateProperties({
                  ...componentItem.properties,
                  fontStyle: value ? "italic" : "normal",
                })
              }
              onUnderlineChange={(value) =>
                onUpdateProperties({
                  ...componentItem.properties,
                  textDecoration: value ? "underline" : "none",
                })
              }
              onStrikethroughChange={(value) =>
                onUpdateProperties({
                  ...componentItem.properties,
                  textDecoration: value ? "line-through" : "none",
                })
              }
            />
            <PropertyGroup>
              <Label>색상</Label>
              <Input
                type="color"
                value={componentItem.properties.color || defaultProps.color}
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
                  componentItem.properties.textAlign || defaultProps.textAlign
                }
                onChange={(e) =>
                  onUpdateProperties({
                    ...componentItem.properties,
                    textAlign: e.target.value,
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
                value={componentItem.properties.src || defaultProps.src}
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
                value={componentItem.properties.alt || defaultProps.alt}
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
                componentItem.properties.width || defaultProps.width
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
              <Label>배경색</Label>
              <Input
                type="color"
                value={
                  componentItem.properties.backgroundColor ||
                  defaultProps.backgroundColor
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
                value={componentItem.properties.color || defaultProps.color}
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
                value={componentItem.properties.href || defaultProps.href}
                onChange={(e) =>
                  onUpdateProperties({
                    ...componentItem.properties,
                    href: e.target.value,
                  })
                }
              />
            </PropertyGroup>
            <PropertyGroup>
              <Label>색상</Label>
              <Input
                type="color"
                value={componentItem.properties.color || defaultProps.color}
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

export default PropertyPanel;
