export const mockTemplateContent = {
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <header style="background: #f8f9fa; padding: 20px; text-align: center;">
        <img src="https://via.placeholder.com/150x50" alt="Company Logo" style="max-width: 150px;" />
      </header>
      
      <main style="padding: 20px;">
        <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">안녕하세요, {{name}}님!</h1>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          저희 서비스를 이용해 주셔서 감사합니다. 이번 주 특별 프로모션 소식을 전해드립니다.
        </p>
        
        <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #333; font-size: 20px; margin-bottom: 15px;">이번 주 특가 상품</h2>
          <ul style="color: #666; padding-left: 20px;">
            <li style="margin-bottom: 10px;">상품 A - 30% 할인</li>
            <li style="margin-bottom: 10px;">상품 B - 2+1 이벤트</li>
            <li style="margin-bottom: 10px;">상품 C - 무료 배송</li>
          </ul>
        </div>
        
        <a href="#" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-bottom: 20px;">
          자세히 보기
        </a>
        
        <p style="color: #666; line-height: 1.6; font-size: 14px;">
          본 메일은 발신 전용입니다. 문의사항이 있으시면 고객센터를 이용해 주세요.
        </p>
      </main>
      
      <footer style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
        <p style="margin-bottom: 10px;">
          © 2024 Your Company. All rights reserved.
        </p>
        <p>
          서울특별시 강남구 테헤란로 123 | 고객센터: 02-123-4567
        </p>
      </footer>
    </div>
  `,
  style: `
    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
    }
    
    img {
      max-width: 100%;
      height: auto;
    }
    
    a {
      transition: opacity 0.2s ease;
    }
    
    a:hover {
      opacity: 0.8;
    }
  `,
};
