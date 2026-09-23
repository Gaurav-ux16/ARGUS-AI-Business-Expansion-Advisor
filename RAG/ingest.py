"""
ingest.py
---------
AI Business Expansion Regulatory Advisor - Single TXT RAG Pipeline

This script:
1. Reads the curated knowledge document: documents/Singapore_Regulatory_Guide.txt
2. Performs section-aware parsing and text chunking
3. Generates 384-dimensional embeddings using sentence-transformers/all-MiniLM-L6-v2
4. Rebuilds/initializes the ChromaDB vector database cleanly
5. Stores chunks with complete metadata:
   - country    : "Singapore"
   - source     : "Singapore_Regulatory_Guide.txt"
   - section    : Section title / heading
   - source_url : Official government source URL
   - chunk_id   : Chunk integer index

Run:
    python ingest.py
"""

import sys
import re
import shutil
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

GUIDE_FILE      = Path("documents") / "Singapore_Regulatory_Guide.txt"
CHROMA_FOLDER   = Path("chroma_db")
COLLECTION_NAME = "singapore_regulations"
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
EMBED_BATCH     = 64


# ============================================================
# LOAD EMBEDDING MODEL
# ============================================================

print("=" * 60)
print(f"Loading embedding model ({EMBEDDING_MODEL})...")
print("=" * 60)

embedding_model = SentenceTransformer(EMBEDDING_MODEL)

print("Embedding model loaded.\n")


# ============================================================
# SECTION-AWARE TXT PARSER & CHUNKER
# ============================================================

def parse_and_chunk_guide(file_path: Path) -> list[dict]:
    """
    Parses Singapore_Regulatory_Guide.txt into structured chunks.
    Preserves section titles, subsections, and official source URLs.
    """
    if not file_path.exists():
        raise FileNotFoundError(f"Source file not found: {file_path}")

    text = file_path.read_text(encoding="utf-8", errors="replace")

    # Split by section divider lines (===========================================================)
    section_pattern = r'={10,}\s*\n(\d+\.\s+[^\n]+)\s*\n={10,}'
    splits = re.split(section_pattern, text)

    chunks = []
    chunk_counter = 1

    # Handle intro / header section if present before section 1
    intro_text = splits[0].strip()
    if intro_text:
        urls = re.findall(r'https?://[^\s]+', intro_text)
        chunks.append({
            "chunk_id": chunk_counter,
            "section": "PURPOSE AND OVERVIEW",
            "source_url": urls[0] if urls else "",
            "text": intro_text
        })
        chunk_counter += 1

    # Process each parsed section
    for i in range(1, len(splits), 2):
        sec_title = splits[i].strip()
        sec_body = splits[i+1].strip()

        # Check for subsection headers like '4.1 REPRESENTATIVE OFFICE\n-------------------------'
        sub_pattern = r'(\d+\.\d+\s+[^\n]+)\n\-+'
        sub_parts = re.split(sub_pattern, sec_body)

        if len(sub_parts) > 1:
            intro = sub_parts[0].strip()
            sec_urls = re.findall(r'https?://[^\s]+', sec_body)
            default_url = sec_urls[0] if sec_urls else ""

            if intro:
                chunks.append({
                    "chunk_id": chunk_counter,
                    "section": sec_title,
                    "source_url": default_url,
                    "text": f"[{sec_title}]\n{intro}"
                })
                chunk_counter += 1

            for j in range(1, len(sub_parts), 2):
                sub_title = sub_parts[j].strip()
                sub_body = sub_parts[j+1].strip() if j+1 < len(sub_parts) else ""
                sub_urls = re.findall(r'https?://[^\s]+', sub_body)
                url = sub_urls[0] if sub_urls else default_url

                chunks.append({
                    "chunk_id": chunk_counter,
                    "section": f"{sec_title} > {sub_title}",
                    "source_url": url,
                    "text": f"[{sec_title} > {sub_title}]\n{sub_body}"
                })
                chunk_counter += 1
        else:
            sec_urls = re.findall(r'https?://[^\s]+', sec_body)
            default_url = sec_urls[0] if sec_urls else ""

            # If section body is long (> 1200 chars), split by paragraphs
            if len(sec_body) > 1200:
                paragraphs = [p.strip() for p in sec_body.split('\n\n') if p.strip()]
                current_text = ""
                for p in paragraphs:
                    if len(current_text) + len(p) > 900 and current_text:
                        p_urls = re.findall(r'https?://[^\s]+', current_text)
                        url = p_urls[0] if p_urls else default_url
                        chunks.append({
                            "chunk_id": chunk_counter,
                            "section": sec_title,
                            "source_url": url,
                            "text": f"[{sec_title}]\n{current_text.strip()}"
                        })
                        chunk_counter += 1
                        current_text = p + "\n\n"
                    else:
                        current_text += p + "\n\n"
                if current_text.strip():
                    p_urls = re.findall(r'https?://[^\s]+', current_text)
                    url = p_urls[0] if p_urls else default_url
                    chunks.append({
                        "chunk_id": chunk_counter,
                        "section": sec_title,
                        "source_url": url,
                        "text": f"[{sec_title}]\n{current_text.strip()}"
                    })
                    chunk_counter += 1
            else:
                chunks.append({
                    "chunk_id": chunk_counter,
                    "section": sec_title,
                    "source_url": default_url,
                    "text": f"[{sec_title}]\n{sec_body}"
                })
                chunk_counter += 1

    return chunks


# ============================================================
# MAIN INGESTION
# ============================================================

def run_ingestion():
    print("=" * 60)
    print("STARTING INGESTION")
    print(f"Target document: {GUIDE_FILE.resolve()}")
    print("=" * 60)

    # 1. Parse and chunk TXT
    chunks = parse_and_chunk_guide(GUIDE_FILE)
    print(f"  Successfully read and chunked guide into {len(chunks)} section chunks.\n")

    # 2. Reset ChromaDB directory cleanly if present
    if CHROMA_FOLDER.exists():
        try:
            shutil.rmtree(CHROMA_FOLDER)
            print("  Removed existing chroma_db folder for clean database creation.")
        except Exception as e:
            print(f"  Notice during database cleanup: {e}")

    # 3. Create fresh ChromaDB client
    chroma_client = chromadb.PersistentClient(
        path=str(CHROMA_FOLDER),
        settings=Settings(anonymized_telemetry=False)
    )

    collection = chroma_client.create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"}
    )
    print(f"  Created fresh collection '{COLLECTION_NAME}'.\n")

    # 4. Prepare IDs, documents, metadatas
    chunk_ids   = []
    documents   = []
    metadatas   = []

    for c in chunks:
        cid = f"SG_GUIDE_c{c['chunk_id']:03d}"
        chunk_ids.append(cid)
        documents.append(c["text"])
        metadatas.append({
            "country":    "Singapore",
            "source":     GUIDE_FILE.name,
            "section":    c["section"],
            "source_url": c["source_url"],
            "chunk_id":   c["chunk_id"],
        })

    # 5. Generate embeddings
    print("  Generating embeddings with sentence-transformers...")
    embeddings = embedding_model.encode(
        documents,
        batch_size=EMBED_BATCH,
        show_progress_bar=False
    ).tolist()

    # 6. Add to ChromaDB
    print("  Storing chunks in ChromaDB...")
    collection.add(
        ids=chunk_ids,
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas
    )

    stored_count = collection.count()

    print("\n" + "=" * 60)
    print("INGESTION COMPLETE!")
    print("=" * 60)
    print(f"  Source file    : {GUIDE_FILE.name}")
    print(f"  Total chunks   : {stored_count}")
    print(f"  ChromaDB path  : {CHROMA_FOLDER.resolve()}")
    print(f"  Collection     : {COLLECTION_NAME}")
    print("=" * 60)


if __name__ == "__main__":
    run_ingestion()