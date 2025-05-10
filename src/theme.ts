import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    body: `'GowunDodum-Regular', sans-serif`,
    heading: `'GowunDodum-Regular', sans-serif`,
  },
  styles: {
    global: {
      '@font-face': {
        fontFamily: 'GowunDodum-Regular',
        src: `url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/GowunDodum-Regular.woff') format('woff')`,
        fontWeight: 'normal',
        fontStyle: 'normal',
      },
      body: {
        fontFamily: `'GowunDodum-Regular', sans-serif`,
      },
    },
  },
});

export default theme;
