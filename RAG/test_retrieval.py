"""
test_retrieval.py
-----------------
Singapore RAG - Single TXT Guide Retrieval Verification

Tests vector retrieval using sentence-transformers + ChromaDB.
Calls NO external APIs (pure local retrieval).

Tests the 7 standard evaluation questions:
1. Can a foreign company expand into Singapore?
2. What is Singapore's corporate income tax rate?
3. Can a foreign founder start a company in Singapore?
4. What are the requirements for an Employment Pass?
5. What is the S Pass?
6. What are Singapore's PDPA obligations?
7. What is the difference between a Singapore subsidiary and a foreign company branch?

For each result, displays:
  - Source
  - Section
  - Chunk ID
  - Similarity/Distance
  - Source URL (if available)
  - Retrieved text

Run:
    python test_retrieval.py
"""

import sys
from pathlib import Path

# Fix Windows stdout encoding for non-ASCII characters
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer


# ============================================================
# CONFIGURATION
# ============================================================

CHROMA_FOLDER   = Path("chroma_db")
COLLECTION_NAME = "singapore_regulations"
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
TOP_K           = 3      # Top 3 most relevant chunks per question


# ============================================================
# 7 REQUIRED TEST QUESTIONS
# ============================================================

TEST_QUESTIONS = [
    "Can a foreign company expand into Singapore?",
    "What is Singapore's corporate income tax rate?",
    "Can a foreign founder start a company in Singapore?",
    "What are the requirements for an Employment Pass?",
    "What is the S Pass?",
    "What are Singapore's PDPA obligations?",
    "What is the difference between a Singapore subsidiary and a foreign company branch?",
]


# ============================================================
# LOAD EMBEDDING MODEL & CONNECT TO CHROMADB
# ============================================================

print("=" * 60)
print(f"Loading embedding model ({EMBEDDING_MODEL})...")
print("=" * 60)

embedding_model = SentenceTransformer(EMBEDDING_MODEL)

print("Connecting to ChromaDB...")
chroma_client = chromadb.PersistentClient(
    path=str(CHROMA_FOLDER),
    settings=Settings(anonymized_telemetry=False)
)
collection   = chroma_client.get_collection(name=COLLECTION_NAME)
total_chunks = collection.count()

print(f"Connected. Collection '{COLLECTION_NAME}' contains {total_chunks} chunks.\n")


# ============================================================
# RETRIEVAL FUNCTION (Purely local, no LLM)
# ============================================================

def retrieve_chunks(question: str, top_k: int = TOP_K) -> dict:
    query_vector = embedding_model.encode(question).tolist()
    results = collection.query(
        query_embeddings=[query_vector],
        n_results=top_k,
        include=["documents", "metadatas", "distances"]
    )
    return results


def display_results(question_num: int, question: str, results: dict):
    docs      = results["documents"][0]
    metas     = results["metadatas"][0]
    distances = results["distances"][0]

    print("=" * 70)
    print(f"QUESTION {question_num}: {question}")
    print("=" * 70)

    for rank, (doc, meta, dist) in enumerate(zip(docs, metas, distances), start=1):
        similarity = 1.0 - dist  # Cosine similarity approximation
        quality = (
            "VERY HIGH" if dist < 0.35 else
            "HIGH"      if dist < 0.50 else
            "MODERATE"  if dist < 0.65 else
            "LOW"
        )

        print(f"\n  Result #{rank}  [Match: {quality} | Distance: {dist:.4f} | Similarity: {similarity:.4f}]")
        print(f"  Source    : {meta.get('source', 'N/A')}")
        print(f"  Section   : {meta.get('section', 'N/A')}")
        print(f"  Chunk ID  : {meta.get('chunk_id', 'N/A')}")
        if meta.get("source_url"):
            print(f"  Source URL: {meta.get('source_url')}")
        print("  Retrieved Text:")
        print("  " + "-" * 60)
        for line in doc.strip().splitlines():
            print(f"    {line}")
        print("  " + "-" * 60)

    print()


# ============================================================
# RUN RETRIEVAL TEST SUITE
# ============================================================

def main():
    print("=" * 70)
    print("SINGAPORE RAG — RETRIEVAL EVALUATION TEST SUITE")
    print("No Gemini LLM calls — pure vector retrieval verification")
    print("=" * 70)
    print()

    for idx, question in enumerate(TEST_QUESTIONS, start=1):
        results = retrieve_chunks(question)
        display_results(idx, question, results)

    print("=" * 70)
    print("RETRIEVAL EVALUATION COMPLETE")
    print(f"All {len(TEST_QUESTIONS)} questions successfully tested against ChromaDB ({total_chunks} chunks).")
    print("=" * 70)


if __name__ == "__main__":
    main()
