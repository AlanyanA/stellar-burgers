import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector } from '../../services/store';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { selectIngredients } from '../../services/selectors';

export const BurgerIngredients: FC = () => {
  const ingredients = useSelector(selectIngredients);
  const buns = ingredients.filter((ingredient) => ingredient.type === 'bun');
  const mains = ingredients.filter((ingredient) => ingredient.type === 'main');
  const sauces = ingredients.filter(
    (ingredient) => ingredient.type === 'sauce'
  );

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);
  const titleBunRef = useRef<HTMLHeadingElement>(null);

  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });
  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inViewFilling) {
      setCurrentTab('main');
      return;
    }
    if (inViewSauces) {
      setCurrentTab('sauce');
      return;
    }
    if (inViewBuns) {
      setCurrentTab('bun');
    }
  }, [inViewFilling, inViewSauces, inViewBuns]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
