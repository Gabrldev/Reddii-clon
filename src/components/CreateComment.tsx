"use client";
import { useState } from "react";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { CommentValidatorType } from "@/lib/validators/comment";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type Props = {
  postId: string;
  replyToId?: string;
};
function CreateComment({ postId, replyToId }: Props) {
  const router = useRouter();

  const [input, setInput] = useState<string>("");

  const { loginToast } = useCustomToast();

  const { mutate: comment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentValidatorType) => {
      const payload: CommentValidatorType = {
        postId,
        text,
        replyToId,
      };

      const { data } = await axios.patch(
        `/api/subreddit/post/comment`,
        payload
      );
      return data;
    },

    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast();
        }
      }
      return toast({
        title: "There was a problem",
        description: "Something went wrong, please try again later.",
        variant: "destructive",
      });
    },

    onSuccess: () => {

      toast({
        title: "Comment posted",
        description: "Your comment has been posted.",
        variant: "default",
      })

      router.refresh();
      setInput("");
    },
  });
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="comment"> Your comment </Label>
      <div className="mt-2">
        <Textarea
          id="comment"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          placeholder="What are your thoughts?"
        />
      </div>
      <div className="mt-2 flex justify-end">
        <Button
          isLoading={isLoading}
          onClick={() => comment({ postId, text: input, replyToId })}
          disabled={input.length === 0}
        >
          Post
        </Button>
      </div>
    </div>
  );
}
export default CreateComment;
