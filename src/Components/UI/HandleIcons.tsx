// Types, interfaces and enumns:
import { FC, CSSProperties } from 'react';
export interface HandleIconsProps {
  direction: 'horizontal' | 'vertical';
  icon?:
    | 'threeCircles'
    | 'eightCircles'
    | 'twentyFourCircles'
    | 'twoArrows'
    | 'twoLines'
    | 'oneLineS'
    | 'oneLineL';
  height?: number;
  style?: CSSProperties;
  className?: string;
}
export type directionlessHandleIcon = Omit<HandleIconsProps, 'direction'>;

// Component:
const HandleIcons: FC<HandleIconsProps> = ({
  direction,
  icon = 'oneLineL',
  height,
  style = {},
  className = '',
}) => {
  // JSX:
  const oneLineS = (
    <svg
      height={height || '40px'}
      viewBox='0 0 24 24'
      fill='none'
      transform={`rotate(${direction === 'horizontal' ? 90 : 0})`}
      style={style}
      className={className || 'handle_icon'}
    >
      <g strokeWidth='0'></g>
      <g strokeLinecap='round' strokeLinejoin='round'></g>
      <g>
        <path
          d='M5 12H12H19'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
        ></path>
      </g>
    </svg>
  );

  const oneLineL = (
    <svg
      height={height || '47px'}
      viewBox='0 -0.2 20 20'
      fill='none'
      transform={`rotate(${direction === 'horizontal' ? 90 : 0})`}
      style={style}
      className={className || 'handle_icon'}
    >
      <g strokeWidth='0'></g>
      <g strokeLinecap='round' strokeLinejoin='round'></g>
      <g>
        <path
          d='M2 9.75C2 9.33579 2.33579 9 2.75 9H17.25C17.6642 9 18 9.33579 18 9.75C18 10.1642 17.6642 10.5 17.25 10.5H2.75C2.33579 10.5 2 10.1642 2 9.75Z'
          fill='currentColor'
        ></path>
      </g>
    </svg>
  );

  const twoLines = (
    <svg
      height={height || '24px'}
      viewBox='0 0 48 48'
      fill='currentColor'
      transform={`rotate(${direction === 'horizontal' ? 90 : 0})`}
      style={style}
      className={className || 'handle_icon'}
    >
      <g>
        <title>drag-handle</title>
        <g id='Layer_2' data-name='Layer 2'>
          <g id='invisible_box' data-name='invisible box'>
            <rect width='48' height='48' fill='none'></rect>
          </g>
          <g id='icons_Q2' data-name='icons Q2'>
            <g>
              <path d='M46,20a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2H2a2,2,0,0,1,2-2H44a2,2,0,0,1,2,2Z'></path>
              <path d='M46,28a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2H2a2,2,0,0,1,2-2H44a2,2,0,0,1,2,2Z'></path>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );

  const twoArrows = (
    <svg
      height={height || '11px'}
      viewBox='0 0 24 24'
      transform={`rotate(${direction === 'horizontal' ? 90 : 0})`}
      style={style}
      className={className || 'handle_icon'}
    >
      <path
        fill='currentColor'
        d='M8,18H11V15H2V13H22V15H13V18H16L12,22L8,18M12,2L8,6H11V9H2V11H22V9H13V6H16L12,2Z'
      />
    </svg>
  );

  const threeCircles = (
    <svg
      height={height || '26px'}
      viewBox='0 0 16 16'
      className={className || 'handle_icon'}
      style={style}
      fill='currentColor'
      transform={`rotate(${direction === 'vertical' ? 90 : 0})`}
    >
      <g>
        <g>
          <path d='M8,6.5A1.5,1.5,0,1,0,9.5,8,1.5,1.5,0,0,0,8,6.5Zm0,5A1.5,1.5,0,1,0,9.5,13,1.5,1.5,0,0,0,8,11.47ZM8,4.53A1.5,1.5,0,1,0,6.5,3,1.5,1.5,0,0,0,8,4.53Z'></path>
        </g>
      </g>
    </svg>
  );

  const eightCircles = (
    <svg
      height={height || '14px'}
      viewBox='0 0 1920 1920'
      className={className || 'handle_icon'}
      style={style}
      fill='currentColor'
      transform={`rotate(${direction === 'vertical' ? 90 : 0})`}
    >
      <g>
        <path
          d='M686.211 137.143v-.137l68.572.137H686.21Zm0 1508.571c75.566 0 137.143 61.577 137.143 137.143S761.777 1920 686.211 1920c-75.702 0-137.142-61.577-137.142-137.143s61.44-137.143 137.142-137.143Zm548.572 0c75.566 0 137.143 61.577 137.143 137.143S1310.349 1920 1234.783 1920c-75.703 0-137.143-61.577-137.143-137.143s61.44-137.143 137.143-137.143ZM686.21 1097.143c75.566 0 137.143 61.577 137.143 137.143 0 75.565-61.577 137.143-137.143 137.143-75.702 0-137.142-61.578-137.142-137.143 0-75.566 61.44-137.143 137.142-137.143Zm548.572 0c75.566 0 137.143 61.577 137.143 137.143 0 75.565-61.577 137.143-137.143 137.143-75.703 0-137.143-61.578-137.143-137.143 0-75.566 61.44-137.143 137.143-137.143ZM686.21 548.57c75.566 0 137.143 61.578 137.143 137.143 0 75.566-61.577 137.143-137.143 137.143-75.702 0-137.142-61.577-137.142-137.143 0-75.565 61.44-137.143 137.142-137.143Zm548.572 0c75.566 0 137.143 61.578 137.143 137.143 0 75.566-61.577 137.143-137.143 137.143-75.703 0-137.143-61.577-137.143-137.143 0-75.565 61.44-137.143 137.143-137.143ZM686.21 0c75.566 0 137.143 61.577 137.143 137.143S761.776 274.286 686.21 274.286c-75.702 0-137.142-61.577-137.142-137.143S610.509 0 686.21 0Zm548.503 0c75.566 0 137.143 61.577 137.143 137.143s-61.577 137.143-137.143 137.143c-75.565 0-137.143-61.577-137.143-137.143S1159.15 0 1234.714 0Z'
          fillRule='evenodd'
        ></path>
      </g>
    </svg>
  );

  const twentyFourCircles = (
    <svg
      height={height || '28px'}
      viewBox='0 0 15 15'
      className={className || 'handle_icon'}
      style={style}
      fill='none'
      transform={`rotate(${direction === 'vertical' ? 90 : 0})`}
    >
      <g>
        <circle cx='4.5' cy='2.5' r='.6' fill='currentColor'></circle>
        <circle cx='4.5' cy='4.5' r='.6' fill='currentColor'></circle>
        <circle cx='4.5' cy='6.499' r='.6' fill='currentColor'></circle>
        <circle cx='4.5' cy='8.499' r='.6' fill='currentColor'></circle>
        <circle cx='4.5' cy='10.498' r='.6' fill='currentColor'></circle>
        <circle cx='4.5' cy='12.498' r='.6' fill='currentColor'></circle>
        <circle cx='6.5' cy='2.5' r='.6' fill='currentColor'></circle>
        <circle cx='6.5' cy='4.5' r='.6' fill='currentColor'></circle>
        <circle cx='6.5' cy='6.499' r='.6' fill='currentColor'></circle>
        <circle cx='6.5' cy='8.499' r='.6' fill='currentColor'></circle>
        <circle cx='6.5' cy='10.498' r='.6' fill='currentColor'></circle>
        <circle cx='6.5' cy='12.498' r='.6' fill='currentColor'></circle>
        <circle cx='8.499' cy='2.5' r='.6' fill='currentColor'></circle>
        <circle cx='8.499' cy='4.5' r='.6' fill='currentColor'></circle>
        <circle cx='8.499' cy='6.499' r='.6' fill='currentColor'></circle>
        <circle cx='8.499' cy='8.499' r='.6' fill='currentColor'></circle>
        <circle cx='8.499' cy='10.498' r='.6' fill='currentColor'></circle>
        <circle cx='8.499' cy='12.498' r='.6' fill='currentColor'></circle>
        <circle cx='10.499' cy='2.5' r='.6' fill='currentColor'></circle>
        <circle cx='10.499' cy='4.5' r='.6' fill='currentColor'></circle>
        <circle cx='10.499' cy='6.499' r='.6' fill='currentColor'></circle>
        <circle cx='10.499' cy='8.499' r='.6' fill='currentColor'></circle>
        <circle cx='10.499' cy='10.498' r='.6' fill='currentColor'></circle>
        <circle cx='10.499' cy='12.498' r='.6' fill='currentColor'></circle>
      </g>
    </svg>
  );

  const icons = {
    oneLineS,
    oneLineL,
    threeCircles,
    eightCircles,
    twentyFourCircles,
    twoLines,
    twoArrows,
  };
  return icons[icon];
};

export default HandleIcons;
