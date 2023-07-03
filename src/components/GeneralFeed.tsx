import { INFINITE_SCROLLING_PAGINATION_RESULT } from "@/app/config";
import { db } from "@/lib/db";
import PostFeed from "./PostFeed";

type Props = {};
async function GeneralFeed({}: Props) {
  const posts = await db.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      subreddit: true,
      comments: true,
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULT,
  });
  return <PostFeed initialPosts={posts} />;
}
export default GeneralFeed;
