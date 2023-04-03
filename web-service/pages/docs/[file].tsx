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
  documentName: string,
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
  console.log("pathi", fullPath)
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const metadata = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const content = await remark().use(html).process(metadata.content)
  const contentHtml = content.toString()

  return {
    file: documentName,
    content: contentHtml,
    metadata: metadata.data,
  } as IDocumentData;
}

export const Document: NextPage<IDocumentData> = ({ content }) => {
  return (
    <>
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
      content: documentData.content
    }
  }
}

export default Document;
