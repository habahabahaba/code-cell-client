// 3rd party:
import { FaCode } from 'react-icons/fa6';
import { HiMiniPlusSmall } from 'react-icons/hi2';
import { BiText } from 'react-icons/bi';
// Redux RTK:
// Store:
import { insertCellBefore } from '../store/slices';
import { useAppDispatch } from '../hooks';
// React:
// Context:
// Components:
import Button from './UI/Button';
// CSS:
// Types, interfaces and enumns:
import { FC } from 'react';
import type { cellType } from '../store';

interface CellItemMarginProps {
  id?: string | null;
  forceVisible?: boolean;
}
// Component:
const CellItemMargin: FC<CellItemMarginProps> = ({
  id = null,
  forceVisible,
}) => {
  // Store:
  const dispatch = useAppDispatch();
  // Handlers:
  function handleIsertCell(cellType: cellType) {
    dispatch(insertCellBefore({ neighborId: id, cellType }));

    // If it's the bottom Margin, with no Cell parent:
    // Scroll down to the added cell:
    if (!id) {
      setTimeout(() => {
        // Calculating the bottom position:
        const documentHeight = document.documentElement.scrollHeight;
        const bottomPosition = documentHeight - window.innerHeight;

        // Scrolling to the calculated position:
        window.scrollTo({
          top: bottomPosition,
          behavior: 'smooth',
        });
      }, 0);
    }
  }

  // JSX:
  return (
    <div className={`cell-item-margin ${forceVisible ? 'visible' : null}`}>
      <span className='cell-item-margin-group'>
        <div className='divider-line' />

        <Button
          onClick={() => {
            handleIsertCell('code');
          }}
          className=' is-success is-outlined is-rounded is-small'
          icon={
            <>
              <HiMiniPlusSmall />
              <FaCode />
            </>
          }
        />
        <div className='divider-line' />

        <Button
          onClick={() => {
            handleIsertCell('text');
          }}
          className=' is-success is-outlined  is-rounded is-small'
          icon={
            <>
              <HiMiniPlusSmall />
              <BiText />
            </>
          }
        />
        <div className='divider-line' />
      </span>
    </div>
  );
};

export default CellItemMargin;
