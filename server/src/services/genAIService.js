import { Ollama } from "@langchain/community/llms/ollama";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { InMemoryStore } from "langchain/storage/in_memory";
import { CacheBackedEmbeddings } from "langchain/embeddings/cache_backed";
import { PromptTemplate } from "@langchain/core/prompts";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new Ollama({
  model: "llama3",
  temperature: 0,
});

const questionAnsweringPrompt = PromptTemplate.fromTemplate(`
    Act as an AI assistant check relavancy between  provide highly accurate answers based on the given context, if user query is not relavant to resources do not answer
     question: {context}
     resources: {resources} 

`);
const preProcessing = async (identifier) => {
  const directoryLoader = new DirectoryLoader(`public/temp/pdf/${identifier}`, {
    ".pdf": (path) => {
      console.log(path);
      return new PDFLoader(path);
    },
  });

  const docs = await directoryLoader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 300,
    chunkOverlap: 150,
  });

  const splitDocs = await textSplitter.splitDocuments(docs);

  const underlyingEmbeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
  });

  const inMemoryStore = new InMemoryStore();

  const cacheBackedEmbeddings = CacheBackedEmbeddings.fromBytesStore(
    underlyingEmbeddings,
    inMemoryStore,
    {
      namespace: underlyingEmbeddings.modelName,
    }
  );

  const vectorstore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    cacheBackedEmbeddings
  );

  const retriever = vectorstore.asRetriever(2);

  return retriever;
};

export const sendResponseChunk = async (query, socket, identifier) => {
  try {
    const retriever = await preProcessing(identifier);
    const retrievedDocs = await retriever._getRelevantDocuments(query);
    const documents = retrievedDocs.map((doc) => doc.pageContent);
    const resources = documents.map((doc, index) => `A${index + 1}: ${doc}`).join("\n");

     const chain =  questionAnsweringPrompt.pipe(model).pipe(new StringOutputParser())

    const stream = await chain.stream({
      context:query,
      resources,
    });

    for await (const chunk of stream) {
      socket.emit("send:chunk", chunk);
    }
  } catch (error) {
    console.log(error.message);
  }
};
