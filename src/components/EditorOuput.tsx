import dynamic from "next/dynamic";

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
  return <Output className="text-sm" data={content} renderers={renderers} />;
}

function CustomImageRenderer({}:any){
    
}

export default EditorOuput;
