import axios from "axios";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const href = url.searchParams.get("url");

  if (!href) {
    return new Response("Invalid href", { status: 400 });
  }

  const res = await axios.get(href);

  const titleMath = res.data.match(/<title>(.*?)<\/title>/);

  const title = titleMath ? titleMath[1] : "";

  const descriptionMath = res.data.match(
    /<meta name="description" content="(.*?)">/
  );

  const description = descriptionMath ? descriptionMath[1] : "";

  const imageMatch = res.data.match(
    /<meta property="og:image" content="(.*?)">/
  );

  const imageUrl = imageMatch ? imageMatch[1] : "";

  return new Response(
    JSON.stringify({
      sucess: 1,
      data: {
        title,
        description,
        image: {
          url: imageUrl,
        },
      },
    })
  );
}
