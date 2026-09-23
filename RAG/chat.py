"""
chat.py
-------
Singapore Regulatory RAG Chatbot

Pipeline:
User Question -> Embedding -> ChromaDB Similarity Search -> Top TXT Chunks -> Gemini -> Grounded Answer

Features:
- Pure local retrieval with sentence-transformers/all-MiniLM-L6-v2 + ChromaDB.
- Dual Mode Execution:
    FULL MODE    : Retrieval + Gemini Grounded Answer Generation
    CONTEXT MODE : Retrieval Only (displays retrieved text, source, section, URL)
                   Triggered automatically on Gemini 429 (quota limit), missing API key, or network error.
- Strict Grounded System Prompt enforcing no hallucinated regulations, fees, or thresholds.
- Mandatory legal/tax disclaimer included in responses.
- API keys read safely from .env without logging or exposure.

Run:
    python chat.py
"""

import os
import sys
import re
from pathlib import Path

# Fix Windows terminal encoding for non-ASCII characters
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import chromadb
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer


# ============================================================
# LOAD ENVIRONMENT & CONFIGURATION
# ============================================================

load_dotenv()

GEMINI_API_KEY  = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
CHROMA_FOLDER   = Path("chroma_db")
COLLECTION_NAME = "singapore_regulations"
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
TOP_K           = 4

# Mandatory Legal & Regulatory Disclaimer
LEGAL_DISCLAIMER = (
    "\n\n--- DISCLAIMER ---\n"
    "This system provides informational guidance based on curated Singapore regulatory documents. "
    "It does NOT constitute legal, tax, immigration, or professional advice. "
    "Always verify important expansion decisions with official Singapore government authorities (ACRA, IRAS, MOM, PDPC) "
    "or a licensed professional service provider."
)


# ============================================================
# INITIALIZE GEMINI CLIENT (Optional / Graceful)
# ============================================================

_gemini_client    = None
_gemini_model     = "gemini-3-flash-preview"
_gemini_available = False
_gemini_quota_hit = False

if GEMINI_API_KEY:
    try:
        from google import genai as _genai
        _gemini_client    = _genai.Client(api_key=GEMINI_API_KEY)
        _gemini_available = True
    except Exception:
        _gemini_available = False


# ============================================================
# INITIALIZE LOCAL RETRIEVAL PIPELINE
# ============================================================

print("=" * 60)
print("Loading embedding model (all-MiniLM-L6-v2)...")
embedding_model = SentenceTransformer(EMBEDDING_MODEL)

try:
    chroma_client = chromadb.PersistentClient(path=str(CHROMA_FOLDER))
    collection    = chroma_client.get_collection(name=COLLECTION_NAME)
    chunk_count   = collection.count()
except Exception as e:
    print(f"ERROR: Cannot connect to ChromaDB: {e}")
    print("Run  python ingest.py  first.")
    raise SystemExit(1)

print(f"ChromaDB ready: {chunk_count} chunks in '{COLLECTION_NAME}'.")
print("=" * 60 + "\n")


# ============================================================
# RETRIEVAL FUNCTION
# ============================================================

def retrieve_chunks(question: str, top_k: int = TOP_K) -> dict:
    query_vector = embedding_model.encode(question).tolist()
    return collection.query(
        query_embeddings=[query_vector],
        n_results=top_k,
        include=["documents", "metadatas", "distances"]
    )


# ============================================================
# GROUNDED PROMPT GENERATION
# ============================================================

_SYSTEM_PROMPT = """\
You are an AI Business Expansion Regulatory Advisor for Singapore.

STRICT GROUNDED RULES:
1. Answer ONLY using the retrieved context provided below.
2. Do NOT invent or assume regulations, tax rates, fees, salary thresholds, quotas, or deadlines not stated in the context.
3. If the context does NOT contain enough information to answer the question, clearly state:
   "The retrieved context does not contain sufficient information to answer this question. Please consult the official Singapore government authority or a licensed advisor."
4. Always cite the relevant Section name and official Source URL when available in the context.
5. Provide a helpful, clear, and professional response.
6. Clearly state that the response provides informational guidance, not legal or tax advice.
"""

def generate_answer_with_gemini(question: str, context: str) -> str | None:
    """
    Calls Gemini API with grounded context.
    Returns generated string answer, or None if quota/API fails.
    """
    global _gemini_quota_hit, _gemini_available

    if not _gemini_available or _gemini_quota_hit or not _gemini_client:
        return None

    prompt = (
        f"{_SYSTEM_PROMPT}\n\n"
        f"USER QUESTION: {question}\n\n"
        f"RETRIEVED CONTEXT:\n{context}\n\n"
        "GROUNDED ANSWER:"
    )

    try:
        response = _gemini_client.models.generate_content(
            model=_gemini_model,
            contents=prompt,
        )
        return response.text.strip() + LEGAL_DISCLAIMER

    except Exception as e:
        err = str(e)

        if "429" in err:
            _gemini_quota_hit = True
            m = re.search(r"retry in (\d+\.?\d*)s", err)
            wait_str = f" (retry in ~{int(float(m.group(1)))}s)" if m else ""
            print(f"\n  [Gemini API] 429 Quota Limit reached{wait_str}.")
            print("  Switching to RETRIEVAL-ONLY mode for this session.\n")
            return None

        elif "404" in err:
            _gemini_available = False
            print(f"\n  [Gemini API] Model '{_gemini_model}' not found.")
            print("  Switching to RETRIEVAL-ONLY mode.\n")
            return None

        else:
            print(f"\n  [Gemini API] Notice: {type(e).__name__} occurred.")
            print("  Switching to RETRIEVAL-ONLY mode.\n")
            return None


# ============================================================
# DISPLAY FUNCTIONS
# ============================================================

def display_retrieval_only(results: dict):
    """
    Fallback display when Gemini is unavailable (quota/key).
    Shows: 1. Retrieved text, 2. Source, 3. Section, 4. Relevant source URL
    """
    docs      = results["documents"][0]
    metas     = results["metadatas"][0]
    distances = results["distances"][0]

    print("\n" + "=" * 70)
    print("RETRIEVED REGULATORY CONTEXT (Retrieval-Only Mode)")
    print("=" * 70)

    for rank, (doc, meta, dist) in enumerate(zip(docs, metas, distances), start=1):
        similarity = 1.0 - dist
        print(f"\n--- Chunk #{rank} [Similarity: {similarity:.4f} | Distance: {dist:.4f}] ---")
        print(f"  Source    : {meta.get('source', 'N/A')}")
        print(f"  Section   : {meta.get('section', 'N/A')}")
        if meta.get("source_url"):
            print(f"  Source URL: {meta.get('source_url')}")
        print("  Retrieved Text:")
        for line in doc.strip().splitlines():
            print(f"    {line}")

    print(LEGAL_DISCLAIMER)


def display_sources(sources: list[dict]):
    print("\n" + "=" * 70)
    print("SOURCES & REFERENCES")
    print("=" * 70)

    seen = set()
    for meta in sources:
        sec = meta.get("section", "N/A")
        url = meta.get("source_url", "")
        key = (sec, url)
        if key in seen:
            continue
        seen.add(key)
        print(f"  • Section   : {sec}")
        print(f"    Source    : {meta.get('source', 'N/A')}")
        if url:
            print(f"    Official URL: {url}")
        print()


# ============================================================
# MAIN INTERACTIVE CHAT LOOP
# ============================================================

def main():
    global _gemini_available

    mode_status = (
        f"FULL MODE (Gemini {_gemini_model} + ChromaDB)"
        if _gemini_available and not _gemini_quota_hit
        else "RETRIEVAL-ONLY MODE (ChromaDB Vector Retrieval)"
    )

    print("\n" + "=" * 70)
    print("[SG] SINGAPORE REGULATORY ADVISOR")
    print(f"     Status: {mode_status}")
    print("=" * 70)
    print("\nAsk any question about Singapore business expansion & regulations.")
    print("Type 'exit' or 'quit' to end.\n")

    while True:
        try:
            question = input("You: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\nGoodbye!")
            break

        if not question:
            continue

        if question.lower() in {"exit", "quit", "q"}:
            print("Goodbye!")
            break

        print("\nSearching regulatory documents...")
        results = retrieve_chunks(question, top_k=TOP_K)

        docs   = results["documents"][0]
        metas  = results["metadatas"][0]

        context_blocks = []
        for i, (d, m) in enumerate(zip(docs, metas), start=1):
            context_blocks.append(
                f"[Source Chunk #{i}]\n"
                f"Section: {m.get('section', 'N/A')}\n"
                f"Official URL: {m.get('source_url', 'N/A')}\n\n"
                f"{d}"
            )
        context_str = "\n\n" + ("=" * 40) + "\n\n".join(context_blocks)

        answer = generate_answer_with_gemini(question, context_str)

        if answer:
            print("\n" + "=" * 70)
            print("ANSWER")
            print("=" * 70)
            print(answer)
            display_sources(metas)
        else:
            display_retrieval_only(results)

        print()


if __name__ == "__main__":
    main()