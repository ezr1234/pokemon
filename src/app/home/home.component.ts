import {
  Characteristics,
  Pokemon,
  PokemonWithCharacteristics,
} from 'src/types/Pokemon';
import { Store, select } from '@ngrx/store';
import {
  decreaseOffset,
  increaseOffset,
  setLimit,
  setPokemonList,
} from '../pokemon.actions';

import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PokemonState } from '../pokemon.reducer';
import api from 'src/config/axios';
import firstLetterUpper from 'src/functions/firstLetterUpper';

declare var window: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  title = 'pokemon-app';
  pokemonList$: Observable<PokemonWithCharacteristics[]>;
  limit$: Observable<number>;
  offset$: Observable<number>;
  offset: number = 0;
  commentModal: any;
  detailsModal: any;
  selectedPokemon: PokemonWithCharacteristics | undefined;

  constructor(private store: Store<{ pokemon: PokemonState }>) {
    this.pokemonList$ = store
      .pipe(select('pokemon'))
      .pipe(select('pokemonList'));
    this.limit$ = store.pipe(select('pokemon')).pipe(select('limit'));
    this.offset$ = store.pipe(select('pokemon')).pipe(select('offset'));
    this.offset$.subscribe((event) => (this.offset = event));
    this.fetchPokemonList();
  }

  ngOnInit() {
    this.commentModal = new window.bootstrap.Modal(
      document.getElementById('commentModal')
    );
    this.detailsModal = new window.bootstrap.Modal(
      document.getElementById('detailsModal')
    );
  }

  openCommentsModal(pokemon: PokemonWithCharacteristics) {
    this.commentModal.show();
    this.selectedPokemon = pokemon;
    // put the value on the inputs if there is a comment
    if (pokemon.comment) {
      (<HTMLInputElement>document.getElementById("commentName")).value = pokemon.comment.name;
      (<HTMLInputElement>document.getElementById("comment")).value = pokemon.comment.comment;
    }
  }

  submitComment() {
    const name = (<HTMLInputElement>document.getElementById("commentName")).value;
    const comment = (<HTMLInputElement>document.getElementById("comment")).value;
    console.log(name, comment)

    this.pokemonList$.subscribe((pokemonList) => {
      const list = pokemonList.map(e => ({ ...e }))
      const index = pokemonList.indexOf(this.selectedPokemon as PokemonWithCharacteristics);
      list[index].comment = { name, comment }
      console.log(list[index])
      this.store.dispatch(setPokemonList(list));
    });
    (<HTMLInputElement>document.getElementById("commentName")).value = "";
    (<HTMLInputElement>document.getElementById("comment")).value = "";
    this.commentModal.hide();
  }

  handleSearchChange() {
    const value = (<HTMLInputElement>document.getElementById("searchInput")).value;
    // get the pokemon list from the store
    this.pokemonList$.subscribe((pokemonList) => {
      // filter the list to only include the pokemon that match the search
      console.log(pokemonList, "oii")
      const filteredList = pokemonList.filter((pokemon) =>
        pokemon.name.includes(value.toLowerCase())
      );
      // set the pokemon list to the filtered list
      this.store.dispatch(setPokemonList(filteredList));
    })
  }

  clearSearch() {
    this.fetchPokemonList();
  }

  deleteComment(pokemon: PokemonWithCharacteristics) {
    // delete the comment from the pokemon
    this.pokemonList$.subscribe((pokemonList) => {
      const list = pokemonList.map(e => ({ ...e }))
      const index = pokemonList.indexOf(pokemon);
      list[index].comment = undefined;
      this.store.dispatch(setPokemonList(list));
    })
    window.alert("Comentário excluido com sucesso!")
  }

  openDetailsModal() {
    this.detailsModal.show();
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
          result.push({
            ...e,
            name: firstLetterUpper(e.name),
            characteristics
          });
        }

        this.store.dispatch(setPokemonList(result));

        console.log(result);
      });
  }

  async getPokemonCharacteristics(pokemon: Pokemon): Promise<Characteristics | undefined> {
    try {
      const { data } = await api.get(
        `/pokemon/${pokemon.name}`
      );
      console.log(data, "oii");
      return data;
    } catch (err) {
      console.log(err);
      return undefined;
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
