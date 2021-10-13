import React, { memo } from 'react';
import MuiIconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

interface Props extends IconButtonProps {
  children: string;
  iconClassName?: string;
}

const IconButton = ({ children, iconClassName, ...rest }: Props) => (
  <MuiIconButton {...rest}>
    <Icon className={iconClassName}>{children}</Icon>
  </MuiIconButton>
);

export default memo(IconButton);
