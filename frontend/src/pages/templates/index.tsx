import { useNavigate } from "react-router-dom";
import styled from "styled-components";

interface TemplateItem {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  thumbnail?: string;
}

// 임시 데이터
const MOCK_TEMPLATES: TemplateItem[] = [
  {
    id: "1",
    name: "기본 뉴스레터",
    description: "기본적인 뉴스레터 템플릿입니다.",
    updatedAt: "2024-03-15",
    thumbnail: "https://via.placeholder.com/300x200",
  },
  {
    id: "2",
    name: "프로모션 안내",
    description: "상품 프로모션 안내용 템플릿입니다.",
    updatedAt: "2024-03-14",
    thumbnail: "https://via.placeholder.com/300x200",
  },
];

const TemplatesPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Header>
        <Title>이메일 템플릿</Title>
        <CreateButton onClick={() => navigate("/templates/new")}>
          + 새 템플릿
        </CreateButton>
      </Header>
      <Content>
        <TemplateGrid>
          {MOCK_TEMPLATES.map((template) => (
            <TemplateCard
              key={template.id}
              onClick={() => navigate(`/templates/${template.id}`)}
            >
              <CardThumbnail>
                {template.thumbnail ? (
                  <img src={template.thumbnail} alt={template.name} />
                ) : (
                  <PlaceholderIcon>✉️</PlaceholderIcon>
                )}
              </CardThumbnail>
              <CardContent>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
                <CardDate>마지막 수정: {template.updatedAt}</CardDate>
              </CardContent>
            </TemplateCard>
          ))}
        </TemplateGrid>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #333;
  margin: 0;
`;

const CreateButton = styled.button`
  padding: 0.625rem 1rem;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #1557b0;
  }
`;

const Content = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
`;

const TemplateCard = styled.div`
  border: 0.0625rem solid #e0e0e0;
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-0.25rem);
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  }
`;

const CardThumbnail = styled.div`
  aspect-ratio: 16/9;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlaceholderIcon = styled.div`
  font-size: 2rem;
  color: #999;
`;

const CardContent = styled.div`
  padding: 1rem;
`;

const CardTitle = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1rem;
  color: #333;
`;

const CardDescription = styled.p`
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
  color: #666;
  line-height: 1.4;
`;

const CardDate = styled.div`
  font-size: 0.75rem;
  color: #999;
`;

export default TemplatesPage;
