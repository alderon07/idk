import { HTTPResponse } from "@trpc/server/dist/http/internals/types";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

type Ability = {
  ability: {
    name: string,
    url: string,
  },
  is_hidden: boolean,
  slot: number,
}

type Sprite = {
  back_default: string,
  back_female: string,
  back_shiny: string,
  back_shiny_female: string, 
  front_default: string,
  front_female: string,
  front_shiny: string,
  front_shiny_female: string,
}

type Pokemon = {
  id: number,
  name: string,
  height: number,
  order: number,
  weight: number,
  abilities?: Ability[],
  base_experience?: number,
  sprites: Sprite,
} 
 
export const pokemonRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ name: z.string()}))
    .query(async ({ input }): Promise<Pokemon> => {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${input?.name?.toLowerCase()}`, {method: 'get'}
      );

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      const pokemon: Pokemon = await response.json() as Pokemon;
      return pokemon;
    }),
});
