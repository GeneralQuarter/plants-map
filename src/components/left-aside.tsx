import { Flex } from '@contentful/f36-components';
import tokens from '@contentful/f36-tokens';
import styled from '@emotion/styled';

const LeftAside = styled(Flex)`
  position: absolute;
  z-index: 1000;
  left: 0;
  width: 280px;
  background-color: ${tokens.gray100};
  top: 70px;
  border-bottom-right-radius: 4px;
  box-shadow: ${tokens.boxShadowPositive};
`;

export default LeftAside;