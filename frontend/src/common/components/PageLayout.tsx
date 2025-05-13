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
  padding: 32px;
  // max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1a2230;
  margin: 0 0 8px 0;
`;

const PageDescription = styled.p`
  color: #64748b;
  margin: 0;
  font-size: 14px;
`;

const ContentSection = styled.section`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
`;
