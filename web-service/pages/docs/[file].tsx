import * as fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from 'remark-html';
import { NextPage } from "next";

interface IDocumentMetadata {
  title: string
  id: string
}

interface IDocumentData {
  name: string,
  metadata: IDocumentMetadata
  content: string
}

function getAllDocuments() {
  const docsDirectory = path.join(process.cwd(), `docs`);
  let mdDocs: any = [];

  fs.readdirSync(docsDirectory).forEach(docFile => {
    mdDocs.push({ params: { file: docFile.replace(/\.md$/, '') } })
  })

  return mdDocs;
}

async function getDocumentData(documentName: string): Promise<IDocumentData> {
  const fullPath = path.join(process.cwd(), `docs/${documentName}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const metadata = matter(fileContents);

  console.log(metadata.data)

  // Use remark to convert markdown into HTML string
  const content = await remark().use(html).process(metadata.content)
  const contentHtml = content.toString()

  return {
    name: documentName,
    content: contentHtml,
    metadata: metadata.data,
  } as IDocumentData;
}

export const Document: NextPage<IDocumentData> = ({ content, name }) => {
  return (
    <>
      <h1>{name}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </>
  )
}

export async function getStaticPaths() {
  const paths = getAllDocuments();

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const documentData = await getDocumentData(params.file);

  return {
    props: {
      name: documentData.name,
      metadata: documentData.metadata,
      content: documentData.content,
    }
  }
}

export default Document;
