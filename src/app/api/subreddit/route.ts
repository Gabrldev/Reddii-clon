import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    // si existe la sesion
    if (!session?.user) return new Response("Unauthorized", { status: 401 });
    // obtenemos el body
    const body = await req.json();
    // validamos el body con zod
    const { name } = SubredditValidator.parse(body);
    // verificamos si el subreddit existe
    const subredditExists = await db.subreddit.findFirst({
      where: { name },
    });
    // si existe respondemos con un 409
    if (subredditExists) return new Response("Subreddit already exists", { status: 409 });
    // si no existe lo creamos
    const subreddit = await db.subreddit.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });
    // creamos la subscripcion
    await db.subscription.create({
      data: {
        userId: session.user.id,
        subredditId: subreddit.id,
      },
    });
    // respondemos con el subreddit creado
    return new Response(subreddit.name, { status: 201 });
  } catch (error) {
    // si el error es de zod
    if (error instanceof z.ZodError) return new Response(error.message, { status: 422 });

    // si no es de zod
    return new Response("Could not create subreddit", { status: 500 });
  }
}
