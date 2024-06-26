// pull from the database using a feathers internal service, also pulling from the instance id in the query params

export default async function getGameData() {
  // implement the feathers internal service later, for now just return static vals
  const reps = 5;
  const sets = 10;
  return {
    reps,
    sets,
    ok: true
  };
}
