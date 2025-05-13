import type { ReactNode } from "react";
import styled from "styled-components";

interface PageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const PageLayout = ({ title, description, children }: PageLayoutProps) => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>{title}</PageTitle>
        {description && <PageDescription>{description}</PageDescription>}
      </PageHeader>
      <ContentSection>{children}</ContentSection>
    </PageContainer>
  );
};

export default PageLayout;

const PageContainer = styled.div`
  padding: 2rem;
  margin: 0 auto;
  width: 100%;
  min-height: calc(100vh - 4rem); // 헤더 높이를 제외한 전체 높이
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  flex-shrink: 0;
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a2230;
  margin: 0 0 0.5rem 0;
`;

const PageDescription = styled.p`
  color: #64748b;
  margin: 0;
  font-size: 0.875rem;
`;

const ContentSection = styled.section`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  flex: 1;
  overflow: auto;
`;
