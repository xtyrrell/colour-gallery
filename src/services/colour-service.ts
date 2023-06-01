export interface Colour {
  hexCode: string;
  name: string;
}


// TODO: get DB better
export const getColours = async (DB: any): Promise<Colour[]> => {
  const r = await DB.prepare(
    "SELECT * FROM colours"
  )
    .bind()
    .all();
  
  const dbColours = r.results as {hex_code: string, name: string}[];
  const colours = dbColours.map(colour => ({...colour, hexCode: colour.hex_code}))

  return colours
}
