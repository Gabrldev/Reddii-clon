import { Post, Vote, VoteType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import PostVoteClient from "./PostVoteClient";

type Props = {
  postId: string;
  initalVoteAmt?: number;
  intialVote?: VoteType | null;
  getData: () => Promise<(Post & { votes: Vote[] }) | null>;
};

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
async function PostVoteServer({
  getData,
  postId,
  initalVoteAmt,
  intialVote,
}: Props) {
  const session = await getServerSession();

  let _votesAmt: number = 0;

  let _currentVote: VoteType | null | undefined = undefined;

  if (getData) {
    await wait(1000);
    const post = await getData();
    if (!post) return notFound();

    _votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;
      return acc;
    }, 0);

    _currentVote = post.votes.find(
      (vote) => vote.userId === session?.user.id
    )?.type;
  } else {
    _votesAmt = initalVoteAmt!;
    _currentVote = intialVote;
  }

  return (
    <PostVoteClient
      postId={postId}
      initialVotesAmt={_votesAmt}
      initialVote={_currentVote}
    />
  );
}
export default PostVoteServer;
