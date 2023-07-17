import { createReducer, on } from '@ngrx/store';
import {
  setPokemonList,
  setLimit,
  increaseOffset,
  decreaseOffset,
} from './pokemon.actions';
import { PokemonWithCharacteristics } from 'src/types/Pokemon';

export type PokemonState = {
  pokemonList: PokemonWithCharacteristics[];
  offset: number;
  limit: number;
};

export const initialState: PokemonState = {
  pokemonList: [],
  offset: 0,
  limit: 20,
};

const _pokemonReducer = createReducer(
  initialState,
  on(setPokemonList, (state, { pokemonList }) => ({ ...state, pokemonList })),
  on(increaseOffset, (state) => {
    return { ...state, offset: state.offset + 10 };
  }),
  on(decreaseOffset, (state) => ({
    ...state,
    offset: state.offset === 0 ? state.offset : state.offset - 10,
  })),
  on(setLimit, (state, { limit }) => ({ ...state, limit }))
);

export function pokemonReducer(state: any, action: any) {
  return _pokemonReducer(state, action);
}
