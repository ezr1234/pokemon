import { Characteristics, PokemonWithCharacteristics } from 'src/types/Pokemon';
import { Store, select } from '@ngrx/store';

import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PokemonState } from '../pokemon.reducer';
import api from 'src/config/axios';

declare var window: any;
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  pokemonList$: Observable<PokemonWithCharacteristics[]>;
  pokemonName: string = '';
  pokemonData: Characteristics | undefined;
  detailsModal: any;

  constructor(private store: Store<{ pokemon: PokemonState }>, private route: ActivatedRoute) {
    this.pokemonList$ = store
      .pipe(select('pokemon'))
      .pipe(select('pokemonList'));
  }


  ngOnInit() {
    this.detailsModal = new window.bootstrap.Modal(
      document.getElementById('detailsModal')
    );
    this.route.queryParams
      .subscribe(params => {
        console.log(params); // { orderby: "price" }
        this.pokemonName = params["name"];
        console.log(this.pokemonName); // price
      }
      );

    this.getPokemonCharacteristics(this.pokemonName.toLowerCase()).then((val) => {
      console.log(val);
      this.pokemonData = val;
    })
  }

  async getPokemonCharacteristics(pokemonName: string): Promise<Characteristics | undefined> {
    try {
      const { data } = await api.get(
        `/pokemon/${pokemonName}`
      );
      console.log(data, "oii");
      return data;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  openDetailsModal() {
    this.detailsModal.show();
    // get the pokemon from the pokemonList with the name
  }

}
