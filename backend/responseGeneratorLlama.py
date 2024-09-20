from langchain_openai import OpenAIEmbeddings
import instructor
from langchain_community.vectorstores import Chroma
from langchain.prompts import PromptTemplate
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()  # Carga el archivo .env
api_key = os.getenv("GROQ_API_KEY")
print(f"Current working directory: {os.getcwd()}")

client = instructor.patch(Groq(
    api_key=os.environ.get("GROQ_API_KEY")
))

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
        model="llama-3.1-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": """Tu papel es responder a las consultas del usuario basándote en los datos que se proporcionarán como documentos relevantes. Siempre deberás responder utilizando la información del documento que comparto, pero necesitarás pensar paso a paso y, a veces, calcular la respuesta basándote en la información proporcionada. No esperes que la información esté literalmente presente, sino de una manera que te permita calcular y pensar cuál es la respuesta. Siempre utilizarás los datos de los documentos compartidos. Siempre responderás en el mismo idioma en el que se te pregunte.
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