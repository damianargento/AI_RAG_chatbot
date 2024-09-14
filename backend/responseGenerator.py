from langchain_openai import OpenAI as OpenAI_lc
from langchain_openai import OpenAIEmbeddings
from openai import OpenAI
import instructor
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_community.vectorstores import Chroma
from langchain.prompts import PromptTemplate

client = instructor.patch(OpenAI())
llm = OpenAI_lc()


def get_relevant_documents(q):

    db = Chroma(embedding_function=OpenAIEmbeddings(),persist_directory="./chroma_db")
    docs = db.similarity_search(q)

    return docs

def returnResultsFromDocument(query, documents):
    stringDocuments = ""
    for document in documents:
        stringDocuments+=document.page_content
    print(stringDocuments)
    prompt_template = f"Relevant Documents:{stringDocuments}. User query:{query}. Helpful answer:"
    PROMPT = PromptTemplate(template=prompt_template, input_variables=['context', 'question'])
    prompt = PROMPT.format(extraction_string=documents,query=query)

    response=client.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": """Your role is to respond to user query based on data that will be provided as relevant documents.\
                    You will always respond using the information from the document that I am sharing but you will need to think step by step and sometimes calculate the answer based on the information provided.
                    Don't expect the information to be literally present but more in a way that will allow you to calculate and think what the answer is.
                    You will always use the data form the documents shared.
                """,
            },
            {"role": "user", "content": prompt},
        ],
    )
    return response.choices[0].message

def format_text(text):
    text = text.replace('\n', '&#10;')
    text = text.replace('"', '&#34;')

    return text

def generateResponse(query):
    return format_text(returnResultsFromDocument(query, get_relevant_documents(query)).content)