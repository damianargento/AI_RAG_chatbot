from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from responseGenerator import generateResponse
from langchain_community.document_loaders import PyPDFLoader
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from pathlib import Path
import shutil
import os

from typing import Dict
app = FastAPI()
import os

uploaded_files = {} 

# Allow requests from all origins with all methods (not recommended for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/query")
async def query(query: str = 'How are you today?'):
    return generateResponse(query)

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):

    if file.content_type != 'application/pdf':
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    temp_file_path = Path(f"{file.filename}")

    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    loader = PyPDFLoader(str(temp_file_path))

    documentsSections = loader.load()

    embedings = OpenAIEmbeddings()
    db = Chroma.from_documents(documentsSections, embedings, persist_directory='./chroma_db')
    db.persist()

    os.remove(temp_file_path)

    return {"filename": file.filename, "message": "File uploaded successfully"}

@app.get("/files")
async def list_files():
    db = Chroma(persist_directory="./chroma_db")
    docs = db.get()["metadatas"]
    # Extract unique sources
    unique_sources = set(doc["source"] for doc in docs)

    # Convert the set to a list if needed
    unique_sources_list = list(unique_sources)
    return {"uploaded_files": unique_sources_list}

@app.delete("/files/{filename}")
async def delete_file(filename: str):
    try:
        # Fetch all documents that match the given filename
        db = Chroma(persist_directory="./chroma_db")

        docIds = db.get()["ids"]
        docMetadatas = db.get()["metadatas"]
        docs = list(zip(docIds, docMetadatas))
        print(docs)
        # Iterate through the documents and check the filenames
        docs_to_delete = [doc for doc in docs if doc[1]["source"] == filename]
        if not docs_to_delete:
            print(f"No documents found with filename: {filename}")
            return
        
        # Deleting each document
        for doc in docs_to_delete:
            doc_id = doc[0]  # Assuming each document has a unique 'id' field
            db.delete(doc_id)
            print(f"Deleted document with ID: {doc_id}")

        print(f"All documents with filename '{filename}' have been deleted.")
    except Exception as e:
        print(f"An error occurred while deleting documents: {e}")
