import { z } from "zod";

export const PostVoteValidator = z.object({
  postId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
});

export type PostVoteValidatorType = z.infer<typeof PostVoteValidator>;

export const PostCommentVoteValidator = z.object({
  commentId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
});

export type PostCommentVoteValidatorType = z.infer<
  typeof PostCommentVoteValidator
>
