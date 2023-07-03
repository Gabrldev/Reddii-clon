"use client";
import { ExtendedPost } from "@/types/db";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { INFINITE_SCROLLING_PAGINATION_RESULT } from "../app/config";
import axios from "axios";
import { useSession } from "next-auth/react";
import Post from "./Post";

type Props = {
  initialPosts: ExtendedPost[];
  subredditName?: string;
};
function PostFeed({ initialPosts, subredditName }: Props) {
  const lastPostRef = useRef<HTMLElement>(null);

  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data: session } = useSession();

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-query"],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit${INFINITE_SCROLLING_PAGINATION_RESULT}&page=${pageParam}` +
        (!!subredditName ? `&subredditName=${subredditName}` : "");

      const { data } = await axios.get(query);
      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },

      initialData: { pages: [initialPosts], pageParams: [1] },
    }
  );

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, index) => {
        const voteAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1;
          if (vote.type === "DOWN") return acc - 1;
          return acc;
        }, 0);

        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user.id
        );

        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post
                post={post}
                subredditName={post.subreddit.name}
                commentAmt={post.comments.length}
                currentVote={currentVote}
                voteAmt={voteAmt}
              />
            </li>
          );
        } else {
          return (
            <Post
              key={post.id}
              post={post}
              subredditName={post.subreddit.name}
              commentAmt={post.comments.length}
              currentVote={currentVote}
              voteAmt={voteAmt}
            />
          );
        }
      })}
    </ul>
  );
}

export default PostFeed;
