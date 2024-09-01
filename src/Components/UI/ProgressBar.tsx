// 3rd party:
// Redux RTK:
// Store:
// React:
// Context:
// Components:
// CSS:

// Types, interfaces and enumns:
import { CSSProperties, FC } from 'react';
interface ProgressBarProps {
  className?: string;
  style?: CSSProperties;
  title?: string;
  max?: number;
  color?: 'is-primary' | 'is-success' | 'is-warning' | 'is-danger';
}

// Component:
const ProgressBar: FC<ProgressBarProps> = ({
  className = '',
  style = {},
  title = 'Loading ...',
  max = 100,
  color = 'is-success',
}) => {
  // JSX:
  return (
    <div className={className} style={style}>
      <div className={`progress-cover`}>
        <progress className={`progress is-small ${color}`} max={'' + max}>
          {title}
        </progress>
      </div>
    </div>
  );
};

export default ProgressBar;
