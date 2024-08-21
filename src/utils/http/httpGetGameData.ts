// pull from the database using a feathers internal service, also pulling from the instance id in the query params

export default async function httpGetGameData() {
  // implement the feathers internal service later, for now just return static vals
  const numTargets = 50;
  return {
    numTargets,
    ok: true, // mimic a 200 response
  };
}
