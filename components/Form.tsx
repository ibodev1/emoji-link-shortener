"use client";

import Link from "next/link";
import { useState } from "react";

export const CreateLinkForm = () => {
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const isMutating = isFetching;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setIsFetching(true);

    const a = await fetch("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });
    setId(a.headers.get("urlId"));
    setSlug(a.headers.get("slug"));
    setUrl("");
    setIsFetching(false);
  }

  if (slug)
    return (
      <>
        <CreatedLink id={id} slug={decodeURI(slug)} />
        <div className="pt-6" />

        <div className="flex gap-4">
          <button
            type="button"
            className="font-semibold underline decoration-secondary decoration-1 underline-offset-4 transition-colors hover:decoration-primary"
            onClick={() => {
              setSlug(null), setId(null);
            }}
          >
            Create New Link
          </button>
          <Link
            href="/"
            className="font-semibold underline decoration-secondary decoration-1 underline-offset-4 transition-colors hover:decoration-primary"
          >
            Go Home
          </Link>
        </div>
      </>
    );

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <input
          type="url"
          name="url"
          id="url"
          autoComplete="off"
          placeholder="https://link-you-wanna-shorten.com"
          className="w-[17rem] border-b border-b-secondary bg-dark focus:border-b-primary focus:outline-none"
          required
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <button
          type="submit"
          disabled={isMutating}
          className={`font-semibold underline decoration-secondary decoration-1 underline-offset-4 transition-colors hover:decoration-primary ${
            isMutating ? "cursor-not-allowed opacity-70" : ""
          }`}
        >
          Shorten With Emojis
        </button>
      </div>
    </form>
  );
};

const CreatedLink = ({ id, slug }: { id: string | null; slug: string }) => {
  const link = window.origin + "/" + slug;
  const linkId = window.origin + "/" + id;
  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold tracking-wide text-primary">
        From Emojies :
        <a target="_blank" href={link} rel="nofollow">
          {link}
        </a>
      </p>
      <p className="text-lg font-semibold tracking-wide text-primary">
        From Id :
        <a target="_blank" href={linkId} rel="nofollow">
          {linkId}
        </a>
      </p>
      <button
        type="button"
        className="font-semibold underline decoration-secondary decoration-1 underline-offset-4 transition-colors hover:decoration-primary"
        onClick={() => navigator.clipboard.writeText(link)}
      >
        Copy
      </button>
    </div>
  );
};
