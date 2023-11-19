import * as schema from "@colyseus/schema"

export class BombaSchema extends schema.Schema {
  
}

schema.defineTypes(BombaSchema, {
  x: "number",
  y: "number",
  tamanho: "number",
})

export class Bomba {
  
}