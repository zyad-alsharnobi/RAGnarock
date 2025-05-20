# Information Retrieval System

A document retrieval and question-answering system that uses vector embeddings to find relevant documents and Google's Gemini model to generate answers based on the retrieved context.

## Project Overview

This system retrieves information from indexed documents and answers questions based on those documents. It uses:

- **LlamaIndex**: For document indexing and retrieval
- **HuggingFace Embeddings**: For text embeddings (BAAI/bge-small-en-v1.5)
- **Google Gemini 2.0 Flash**: For generating answers based on retrieved documents
- **Flask**: To provide a web interface

## Setup

### Prerequisites

- Python 3.8+
- Flask
- LlamaIndex
- Google Generative AI Python SDK
- Hugging Face Transformers

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/zyad-alsharnobi/RAGnarok.git
   cd information-retrieval-system
   ```
   
2. Install dependencies:
   ```
   pip install flask llama-index google-generativeai transformers
   ```
3. Set up your Google API key in the code or as an environment variable

### Configuration Files

- **embedding_config.json**: Configuration for the embedding model
  ```json
  {
    "model_name": "BAAI/bge-small-en-v1.5",
    "chunk_size": 256,
    "chunk_overlap": 25
  }
  ```

- **retriever_config.json**: Configuration for the document retriever
  ```json
  {
    "similarity_top_k": 5
  }
  ```

## Usage

1. Start the Flask server:
   ```
   python app.py
   ```

2. Access the web interface at `http://localhost:5000`

3. Enter your query in the search box and get answers based on the indexed documents

## System Architecture

1. **Document Indexing**:
   - Documents are preprocessed and indexed using LlamaIndex
   - Embeddings are created using HuggingFace's model
   - The index is stored in the 'saved_index' directory

2. **Query Processing**:
   - User queries are embedded using the same embedding model
   - Similar documents are retrieved using vector similarity
   - A similarity cutoff of 0.5 is applied to filter relevant documents

3. **Answer Generation**:
   - Google's Gemini model uses retrieved documents as context
   - Answers are generated based on this context and the original query

## API Endpoints

### `/api/query` (POST)

Request body:
```json
{
  "query": "Your question here"
}
```

Response:
```json
{
  "answer": "Generated answer text",
  "context": ["List of document snippets used as context"]
}
```

## Customization

You can adjust the system by modifying:
- The embedding configuration
- Retrieval parameters (top_k, similarity cutoff)
- The prompting strategy for the Gemini model

