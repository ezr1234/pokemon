export type Pokemon = {
  name: string;
  url: string;
};

export type Description = {
  description: string;
  language: {
    name: string;
    url: string;
  };
};

export type PokemonCharacteristics = {
  gene_modulo: number;
  possible_values: number;
  descriptions: Array<Description>;
};

export type PokemonWithCharacteristics = Pokemon & {
  characteristics: PokemonCharacteristics;
  englishDescription: string;
};
