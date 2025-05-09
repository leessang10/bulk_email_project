import { ThemeConfig } from 'antd';

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#722ed1',
    colorBgBase: '#ffffff',
    colorTextBase: '#171717',
    // Gray scale
    colorTextSecondary: '#666666',
    colorTextTertiary: '#999999',
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',
    colorFill: '#f5f5f5',
    colorFillSecondary: '#fafafa',
  },
  components: {
    Button: {
      colorPrimary: '#1677ff',
      colorPrimaryHover: '#4096ff',
      colorPrimaryActive: '#0958d9',
    },
    Card: {
      colorBgContainer: '#ffffff',
    },
    Layout: {
      colorBgHeader: '#ffffff',
      colorBgBody: '#f5f5f5',
    },
  },
};

export const theme = themeConfig as Required<ThemeConfig>;
