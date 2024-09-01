// React:
import { useEffect, useState } from 'react';

// Re-resizable:
import { Resizable } from 're-resizable';

// Components:
import HandleIcons from './HandleIcons';

// CSS:
import styles from './ReResizable.module.css';

// Types, interfaces and enumns:
import type { FC, ReactNode } from 'react';
import type { ResizableProps } from 're-resizable';
import type { directionlessHandleIcon } from './HandleIcons';
interface ReResizableProps {
  direction: 'horizontal' | 'vertical';
  children: ReactNode;
  handleIcon?: directionlessHandleIcon;
  className?: string;
}

// Resizable Component:
const ReResizable: FC<ReResizableProps> = ({
  direction,
  children,
  handleIcon,
  className,
}) => {
  // Updating window size:
  const [innerWidth, setInnerWidth] = useState<number>(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState<number>(window.innerHeight);

  useEffect(() => {
    let timer: number; // for debouncing
    function setWindowSize() {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setInnerWidth(window.innerWidth);
        setInnerHeight(window.innerHeight);
      }, 25);
    }
    window.addEventListener('resize', setWindowSize);
    return () => {
      window.removeEventListener('resize', setWindowSize);
    };
  }, []);

  // JSX:
  // Handle:
  const handleStyles = [
    styles.re_resize_handle,
    direction === 'horizontal'
      ? styles.re_resize_handle_right
      : styles.re_resize_handle_down,
  ].join(' ');

  const icon = <HandleIcons direction={direction} {...handleIcon} />;

  // Conditional props:
  const reResizableProps: ResizableProps =
    direction === 'vertical'
      ? {
          enable: { bottom: true },
          defaultSize: {
            width: '100%',
            height: '', //  for some reason it sets height to content height, but no more than maxHeight; not the same as ommiting "height" altogether.
            // height: '300px',  // safe, unexiting option
          },
          minWidth: '100%',
          minHeight: '75px',
          maxWidth: '100%',
          maxHeight: innerHeight * 0.9,
          //   bounds: 'parent',
          handleComponent: { bottom: icon },
          handleStyles: {
            bottom: {
              bottom: '-10px',
              height: '10px',
              // Making handle the same width as a container:
              width: 'calc(100% + 2px)',
              left: '-1px',
              //   background: 'green',
            },
          },
          handleClasses: { bottom: handleStyles },
          className,
          style: {
            display: 'flex',
            marginBottom: '10px',
            // height: 'min(100%, 300px)',
          },
        }
      : {
          enable: { right: true },
          defaultSize: {
            width: innerWidth * 0.75 - 25,
            height: '100%',
          },
          minWidth: '100px',
          minHeight: '100%',
          maxWidth: innerWidth * 0.75 - 25,
          maxHeight: '100%',
          bounds: 'parent',
          handleComponent: { right: icon },
          handleStyles: {
            right: {
              right: '-10px',
              width: '10px',
            },
          },
          handleClasses: { right: handleStyles },
          className,
          style: {
            display: 'flex',
            marginRight: '10px',
          },
        };

  return <Resizable {...reResizableProps}>{children}</Resizable>;
};

export default ReResizable;
