// 3rd party:
// Redux RTK:
// Store:
// React:
// Context:
// Components:
// CSS:
// Types, interfaces and enumns:
import { CSSProperties, FC } from 'react';
interface ButtonProps {
  onClick: React.PointerEventHandler<HTMLButtonElement>;
  icon?: React.ReactNode;
  textBefore?: React.ReactNode | string;
  textAfter?: React.ReactNode | string;
  className?: string;
  style?: CSSProperties;
}
// Component:
const Button: FC<ButtonProps> = ({
  onClick,
  icon,
  textBefore,
  textAfter,
  className = '',
  style = {}, // temp styling
}) => {
  // JSX:
  return (
    <button className={`button ${className}`} style={style} onClick={onClick}>
      <span>{textBefore}</span>
      {icon}
      <span>{textAfter}</span>
    </button>
  );
};

export default Button;
