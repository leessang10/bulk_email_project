import styled from "styled-components";

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File) => void;
  accept?: string;
  id: string;
}

const FileUploadArea = styled.div`
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #f8fafc;

  &:hover {
    border-color: #4a90e2;
    background-color: #f1f5f9;
  }
`;

const FileUploadIcon = styled.div`
  font-size: 24px;
  color: #64748b;
  margin-bottom: 12px;
`;

const FileUploadText = styled.div`
  color: #1a2230;
  font-weight: 500;
  margin-bottom: 4px;
`;

const FileUploadSubText = styled.div`
  font-size: 13px;
  color: #64748b;
`;

const FileInput = styled.input`
  display: none;
`;

const FileUpload = ({
  file,
  onFileChange,
  accept = ".csv,.xlsx,.xls",
  id,
}: FileUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <>
      <FileUploadArea onClick={() => document.getElementById(id)?.click()}>
        {file ? (
          <>
            <FileUploadIcon>📎</FileUploadIcon>
            <FileUploadText>{file.name}</FileUploadText>
            <FileUploadSubText>
              다른 파일을 선택하려면 클릭하세요
            </FileUploadSubText>
          </>
        ) : (
          <>
            <FileUploadIcon>📤</FileUploadIcon>
            <FileUploadText>이메일 목록 업로드</FileUploadText>
            <FileUploadSubText>
              CSV, 엑셀 파일(.xlsx, .xls)을 클릭하여 업로드하세요
            </FileUploadSubText>
          </>
        )}
      </FileUploadArea>
      <FileInput
        id={id}
        type="file"
        accept={accept}
        onChange={handleFileChange}
      />
    </>
  );
};

export default FileUpload;
