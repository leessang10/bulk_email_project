import { useAtom } from "jotai";
import styled from "styled-components";
import { uploadImageToS3 } from "../../../../../utils/s3Utils";
import {
  editorStateAtom,
  selectedColumnBlockIdAtom,
  selectedComponentBlockIdAtom,
  selectedLayoutIdAtom,
} from "../../../atoms";
import type { ImageBlock } from "../../../types";

const ToolSection = styled.div`
  display: flex;
  gap: 8px;
  padding-bottom: 8px;

  &:not(:last-child) {
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 8px;
  }
`;

const ToolGroup = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;

  &:not(:last-child) {
    padding-right: 8px;
    border-right: 1px solid #e0e0e0;
  }
`;

const Input = styled.input`
  padding: 4px 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  width: 120px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Label = styled.label`
  font-size: 14px;
  color: #666;
  margin-right: 4px;
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  padding: 6px 12px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #495057;

  &:hover {
    background-color: #e9ecef;
  }
`;

const ImageTools = () => {
  const [selectedBlockId] = useAtom(selectedComponentBlockIdAtom);
  const [editorState, setEditorState] = useAtom(editorStateAtom);
  const [selectedLayoutId] = useAtom(selectedLayoutIdAtom);
  const [selectedColumnId] = useAtom(selectedColumnBlockIdAtom);

  const imageBlock =
    selectedLayoutId && selectedColumnId && selectedBlockId
      ? (editorState.layouts[selectedLayoutId].columnBlocks[selectedColumnId]
          .componentBlock as ImageBlock)
      : null;

  if (!imageBlock) return null;

  const updateImage = (updates: Partial<ImageBlock>) => {
    if (!selectedLayoutId || !selectedColumnId) return;

    setEditorState((prev) => ({
      ...prev,
      layouts: {
        ...prev.layouts,
        [selectedLayoutId]: {
          ...prev.layouts[selectedLayoutId],
          columnBlocks: {
            ...prev.layouts[selectedLayoutId].columnBlocks,
            [selectedColumnId]: {
              ...prev.layouts[selectedLayoutId].columnBlocks[selectedColumnId],
              componentBlock: {
                ...imageBlock,
                ...updates,
              },
            },
          },
        },
      },
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input change event triggered");
    const file = e.target.files?.[0];

    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("Selected file:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    try {
      const imageUrl = await uploadImageToS3(file);
      console.log(
        "Upload successful, updating image block with URL:",
        imageUrl
      );
      updateImage({ src: imageUrl });
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  return (
    <ToolSection>
      <ToolGroup>
        <Label>이미지 업로드</Label>
        <FileInput
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleFileUpload}
          onClick={(e) => {
            // 같은 파일을 다시 선택할 수 있도록 value 초기화
            (e.target as HTMLInputElement).value = "";
          }}
        />
        <UploadButton
          onClick={() => {
            console.log("Upload button clicked");
            document.getElementById("imageUpload")?.click();
          }}
        >
          파일 선택
        </UploadButton>
      </ToolGroup>

      <ToolGroup>
        <Label>이미지 URL</Label>
        <Input
          type="text"
          value={imageBlock.src}
          onChange={(e) => updateImage({ src: e.target.value })}
          placeholder="https://"
        />
      </ToolGroup>

      <ToolGroup>
        <Label>대체 텍스트</Label>
        <Input
          type="text"
          value={imageBlock.alt || ""}
          onChange={(e) => updateImage({ alt: e.target.value })}
          placeholder="이미지 설명"
        />
      </ToolGroup>

      <ToolGroup>
        <Label>너비</Label>
        <Input
          type="text"
          value={imageBlock.width || ""}
          onChange={(e) => updateImage({ width: e.target.value })}
          placeholder="예: 100px 또는 100%"
        />
      </ToolGroup>

      <ToolGroup>
        <Label>정렬</Label>
        <select
          value={imageBlock.align || "center"}
          onChange={(e) =>
            updateImage({
              align: e.target.value as "left" | "center" | "right",
            })
          }
        >
          <option value="left">왼쪽</option>
          <option value="center">가운데</option>
          <option value="right">오른쪽</option>
        </select>
      </ToolGroup>
    </ToolSection>
  );
};

export default ImageTools;
