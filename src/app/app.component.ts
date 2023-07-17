import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Description,
  Pokemon,
  PokemonCharacteristics,
  PokemonWithCharacteristics,
} from 'src/types/Pokemon';
import { Store, select } from '@ngrx/store';
import {
  setPokemonList,
  increaseOffset,
  decreaseOffset,
  setLimit,
} from './pokemon.actions';
import api from 'src/config/axios';
import { PokemonState } from './pokemon.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'pokemon-app';
  pokemonList$: Observable<PokemonWithCharacteristics[]>;
  limit$: Observable<number>;
  offset$: Observable<number>;
  offset: number = 0;

  constructor(private store: Store<{ pokemon: PokemonState }>) {
    this.pokemonList$ = store
      .pipe(select('pokemon'))
      .pipe(select('pokemonList'));
    this.limit$ = store.pipe(select('pokemon')).pipe(select('limit'));
    this.offset$ = store.pipe(select('pokemon')).pipe(select('offset'));
    this.offset$.subscribe((event) => (this.offset = event));
    this.fetchPokemonList();
  }
  fetchPokemonList() {
    console.log(this.offset);
    api
      .get(`/pokemon?limit=10&offset=${this.offset}}`)
      .then(async ({ data }: { data: { results: Pokemon[] } }) => {
        // for each pokemon, fetch the characteristics
        // and add them to the pokemon object
        const result = [];
        for (let e of data.results) {
          const characteristics = await this.getPokemonCharacteristics(e);
          // filter the characteristics to only include the english description
          characteristics.descriptions = characteristics.descriptions.filter(
            (e: Description) => e.language.name === 'en'
          );
          result.push({
            ...e,
            characteristics,
            englishDescription: characteristics.descriptions[0].description,
          });
        }

        this.store.dispatch(setPokemonList(result));

        console.log(result);
      });
  }

  async getPokemonCharacteristics(pokemon: Pokemon) {
    try {
      console.log(pokemon.url.split('/')[6]);
      const { data } = await api.get(
        `/characteristic/${pokemon.url.split('/')[6]}`
      );
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  previousPage() {
    const offset: number = this.offset$ as unknown as number;
    this.store.dispatch(decreaseOffset());
    this.store.dispatch(setLimit(10));
    this.fetchPokemonList();
  }

  nextPage() {
    this.store.dispatch(increaseOffset());
    this.store.dispatch(setLimit(10));
    this.fetchPokemonList();
  }
}
