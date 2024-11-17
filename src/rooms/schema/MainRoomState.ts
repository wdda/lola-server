import { Schema, ArraySchema, type } from "@colyseus/schema";

export class SkinColor extends Schema {
  @type("number") r: number;
  @type("number") g: number;
  @type("number") b: number;
}

export class Player extends Schema {
  @type("string") id: string;
  @type("string") clientSessionId: string;
  @type(SkinColor) skinColor: SkinColor
}

export class MainRoomState extends Schema {
  @type([ Player ]) players = new ArraySchema<Player>();
  @type("number") levelId: number;
}
