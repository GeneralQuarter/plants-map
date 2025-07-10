import { Flex, Heading } from '@contentful/f36-components';
import tokens from '@contentful/f36-tokens';
import styled from '@emotion/styled';
import type { FC, PropsWithChildren } from 'react';

const Container = styled(Flex)`
  position: absolute;
  height: 70px;
  top: 0;
  background-color: ${tokens.gray100};
  border-bottom: 1px solid ${tokens.gray300};
  z-index: 10000;
`;

const Header: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <Container
      as="header"
      alignItems="center"
      gap="spacingS"
      fullWidth
      padding="spacingL"
    >
      <Heading marginBottom="none">Terrain</Heading>
      {children}
    </Container>
  );
};

export default Header;
