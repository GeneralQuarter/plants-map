import { Pill } from '@contentful/f36-components';
import styled from '@emotion/styled';
import { colorFromHueIndex } from '../lib/color-from-hue-index';

const ColoredPill = styled(Pill)`
  overflow: hidden;

  &::before {
    content: " ";
    display: block;
    height: 36px;
    width: ${props => (props as any).hueIndex !== null ? '20px' : '0'};
    background-color: ${props => colorFromHueIndex((props as any).hueIndex)} !important;
  }
`;

export default ColoredPill;