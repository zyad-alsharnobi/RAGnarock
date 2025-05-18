import os
import json
from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
from llama_index.core import Settings
from llama_index.core.retrievers import VectorIndexRetriever
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

app = Flask(__name__)

# Load configurations
with open('embedding_config.json', 'r') as f:
    embedding_config = json.load(f)

with open('retriever_config.json', 'r') as f:
    retriever_config = json.load(f)

# Set up Google API
genai.configure(api_key="AIzaSyAyDGCmHX2bwRDtFjMYaHeJ2U0WyyrmBTA")

# Set up embeddings with llama_index
Settings.embed_model = HuggingFaceEmbedding(
    model_name=embedding_config.get("model_name", "BAAI/bge-small-en-v1.5")
)
Settings.chunk_size = embedding_config.get("chunk_size", 256)
Settings.chunk_overlap = embedding_config.get("chunk_overlap", 25)
Settings.llm = None

# Load index from saved location
from llama_index.core import load_index_from_storage
from llama_index.core.storage import StorageContext

storage_context = StorageContext.from_defaults(persist_dir="saved_index")
index = load_index_from_storage(storage_context)

# Set up retriever
retriever = VectorIndexRetriever(
    index=index,
    similarity_top_k=retriever_config.get("similarity_top_k", 5)
)

# Set up Gemini model
model = genai.GenerativeModel(
    model_name="gemini-2.0-flash"
)

def ask_gemini_with_context(question: str, context_nodes: list) -> str:
    context = "Context:\n"
    for node in context_nodes:
        context += node.text + "\n\n"

    prompt = f"""
    **Role**: You are an AI assistant that answers questions based on retrieved documents.

    **Context**:
    {context}

    **Question**:
    {question}

    **Instructions**:
    - Answer concisely using the provided context.
    - If the answer isn't in the context, say "I don't have enough information."
    - Do not make up information.

    **Answer**:
    """

    response = model.generate_content(prompt)
    return response.text

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/query', methods=['POST'])
def query():
    data = request.json
    user_query = data.get('query', '')
    
    if not user_query:
        return jsonify({"error": "No query provided"}), 400
    
    try:
        # Retrieve relevant documents
        retrieved_nodes = retriever.retrieve(user_query)
        
        # Apply similarity cutoff
        similarity_cutoff = 0.5
        filtered_nodes = [n for n in retrieved_nodes if n.score >= similarity_cutoff]
        
        # Generate answer using Gemini
        answer = ask_gemini_with_context(user_query, filtered_nodes)
        
        # Prepare context for response
        context_list = [node.text for node in filtered_nodes]
        
        return jsonify({
            "answer": answer,
            "context": context_list
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
