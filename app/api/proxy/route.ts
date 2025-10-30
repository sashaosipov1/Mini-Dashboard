import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const published = searchParams.get('published');
  const offset = searchParams.get('offset');

  const externalUrl = new URL('https://softlight-front-end-test.vercel.app/api/posts');

  if (offset !== null) {
    externalUrl.searchParams.set('offset', offset);
  }

  if (published !== null && published !== "none") {
    externalUrl.searchParams.set('published', published);
  }

  const res = await fetch(externalUrl, {
    method: "GET",
  });

  const data = await res.json();
  return Response.json(data);
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  
  const res = await fetch(`https://softlight-front-end-test.vercel.app/api/posts/${body.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}