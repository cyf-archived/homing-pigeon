const headers = { "Content-Type": "application/json" };

export async function latestRelease() {
  const resp = await fetch("/homing-pigeon/api/releases/latest/", {
    method: "GET",
    headers,
    // https://nextjs.org/docs/app/building-your-application/caching
    cache: "no-store",
  });

  if (!resp.ok) {
    throw new Error("Failed to fetch data");
  }
  return await resp.json();
}
