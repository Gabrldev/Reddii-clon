"use client";
import { useQuery } from "@tanstack/react-query";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/Command";
import { useCallback, useRef, useState } from "react";
import axios from "axios";
import { Prisma, Subreddit } from "@prisma/client";
import { CommandEmpty } from "cmdk";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import debounce from "lodash.debounce";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

type Props = {};
function SearchBar({}: Props) {
  const router = useRouter();

  const [input, setInput] = useState<string>("");

  const {
    data: queryResults,
    refetch,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      if (!input) return [];
      const { data } = await axios.get(`/api/search?q=${input}`);
      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType;
      })[];
    },

    queryKey: ["search-query"],

    enabled: false,
  });

  const request = debounce(async () => {
    await refetch();
  }, 300);

  const debounceRequest = useCallback(() => {
    request();
  }, []);

  const commandRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(commandRef,()=>{
    setInput("");

  })
  return (
    <Command
      ref={commandRef}
      className="relative rounded-lg border max-w-lg z-50 overflow-visible max-sm:w-60"
    >
      <CommandInput
        value={input}
        onValueChange={(text) => {
          setInput(text);
          debounceRequest();
        }}
        className="w-full outline-none border-none focus:border-none focus:outline-none ring-0"
        placeholder="Search"
      />
      {input.length > 0 ? (
        <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          {isFetching && <CommandEmpty>No results found</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading="Communities">
              {queryResults?.map((subrediit) => (
                <CommandItem
                  key={subrediit.id}
                  onSelect={(e) => {
                    router.push(`/r/${e}`);
                    router.refresh();
                  }}
                  value={subrediit.name}
                >
                  <Users className="mr-2 h-4  w-4" />
                  <a href={`/r/${subrediit.name}`}> r/{subrediit.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      ) : null}
    </Command>
  );
}
export default SearchBar;
