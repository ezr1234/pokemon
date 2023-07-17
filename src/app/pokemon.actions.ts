import { createAction } from '@ngrx/store';

export const setPokemonList = createAction(
  '[Pokemon List] Set Pokemon List',
  (pokemonList: any[]) => ({ pokemonList })
);

export const increaseOffset = createAction('[Pokemon List] Increase Offset');

export const decreaseOffset = createAction('[Pokemon List] Decrease Offset');

export const setLimit = createAction(
  '[Pokemon List] Set Limit',
  (limit: number) => ({ limit })
);
