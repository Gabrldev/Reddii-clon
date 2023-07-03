"use client";
import dynamic from "next/dynamic";
import Image from "next/image";

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  {
    ssr: false,
  }
);

type Props = {
  content: any;
};
const style = {
  paragraph: "0.875rem",
  lineHeight: "1.25rem",
};
const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
};

function EditorOuput({ content }: Props) {
  return <Output className="text-sm" data={content} renderers={renderers} style={style} />;
}

function CustomImageRenderer({ data }: any) {
  const src = data.file.url;

  return (
    <div className="relative w-full min-h-[15rem]">
      <Image src={src} className="object-contain" fill alt="image" />
    </div>
  );
}

function CustomCodeRenderer({ data }: any) {
  return (
    <pre className="bg-gray-800 rounded-md p-4">
      <code className="text-gray-100 text-sm ">{data.code}</code>
    </pre>
  );
}

export default EditorOuput;
