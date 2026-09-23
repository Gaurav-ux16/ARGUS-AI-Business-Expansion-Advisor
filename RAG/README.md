# AI Business Expansion Regulatory Advisor
## Singapore RAG System

A simple, modular Retrieval-Augmented Generation (RAG) pipeline for
answering questions about Singapore business regulations using official
government PDFs.

---

## Architecture

```
PDF Documents
    ↓  PyPDF (page-by-page text extraction)
Raw Text per Page
    ↓  Character-level chunking (1200 chars, 200 overlap)
Text Chunks
    ↓  sentence-transformers/all-MiniLM-L6-v2 (embeddings)
384-dim Vectors
    ↓  ChromaDB PersistentClient (cosine similarity storage)
ChromaDB Collection
    ↓  Query-time: embed question → similarity search → top-5 chunks
Retrieved Context
    ↓  Grounded prompt → Google Gemini 2.5 Flash
Answer + Source Citations (document name + page number)
```

---

## Project Structure

```
RAG/
├── documents/
│   └── singapore/
│       ├── business_registration/   # ACRA PDFs
│       ├── taxation/                # IRAS PDFs
│       ├── labor_employment/        # MOM PDFs
│       ├── data_privacy/            # PDPC / PDPA PDFs
│       ├── foreign_ownership/
│       └── licenses_compliance/
│
├── chroma_db/            # Auto-created by ingest.py (do not commit)
├── ingest.py             # Step 1: ingest PDFs into ChromaDB
├── test_retrieval.py     # Step 2: verify retrieval (no LLM)
├── chat.py               # Step 3: interactive Q&A with Gemini
├── requirements.txt
├── .env                  # Your real keys (do NOT commit)
├── .env.example          # Template — commit this
├── .gitignore
└── README.md
```

---

## Setup

### 1. Prerequisites

- Python 3.10+
- A virtual environment (recommended)

### 2. Install Dependencies

All packages should already be installed if you used the provided
environment. To install from scratch:

```bash
pip install -r requirements.txt
```

### 3. Configure API Keys

Copy `.env.example` to `.env` and add your Gemini API key:

```bash
cp .env.example .env
```

Edit `.env`:
```
GEMINI_API_KEY=your_actual_key_here
```

Get a free Gemini API key at:
[https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

---

## How to Run

### Step 1: Ingest Documents

Processes all PDFs in `documents/singapore/`, extracts text,
creates embeddings, and stores everything in ChromaDB.

```bash
python ingest.py
```

Expected output:
```
Loading embedding model (all-MiniLM-L6-v2)...
Found 13 PDF files.
[1/13] SG_ACRA_Business_Structure.pdf ...
...
INGESTION COMPLETE!
  Total chunks: ~2500
  ChromaDB path: .../chroma_db
```

> You only need to run this once (or when you add new PDFs).

---

### Step 2: Test Retrieval (no LLM)

Verifies that ChromaDB can find relevant chunks for test questions.
Does NOT call Gemini — purely for debugging the retrieval layer.

```bash
python test_retrieval.py
```

You should see relevant chunks for each of the 5 test questions,
with source filenames, page numbers, and similarity distances.

---

### Step 3: Start the Chatbot

Interactive command-line chat powered by Gemini.

```bash
python chat.py
```

Example session:
```
🇸🇬  SINGAPORE REGULATORY ADVISOR

You: What is Singapore's corporate income tax rate?

🔍 Searching regulatory documents...
💬 Generating answer with Gemini...

ANSWER
======
Singapore's standard corporate income tax rate is 17%...
(Source: SG_IRAS_Corporate_Tax_Rates.pdf, Page 3)

SOURCES USED
============
  📄 SG_IRAS_Corporate_Tax_Rates.pdf
       Category: taxation
       Page: 3

You: exit
Goodbye!
```

---

## Design Decisions

| Decision | Reason |
|---|---|
| No LangChain | Kept simple, transparent, easy to debug |
| PyPDF | Pure Python, no Java or external tools required |
| MiniLM-L6-v2 | Fast, small, good quality — ideal for local use |
| ChromaDB | Zero-config persistent vector DB |
| Cosine similarity | Better than L2 for normalized sentence embeddings |
| Chunk size 1200 / overlap 200 | Balances context per chunk vs. retrieval precision |
| Grounded prompt | LLM explicitly told not to use training data |
| Page metadata | Every chunk stores page number for citations |

---

## Hallucination Prevention

The LLM prompt includes strict rules:
1. Answer **only** from the provided context
2. Never invent laws, fees, deadlines, or form numbers
3. Explicitly say when information is not found
4. Never claim to be a lawyer or tax advisor

---

## Test Questions

The 5 built-in test questions cover all major categories:

| Question | Expected Source Category |
|---|---|
| Can a foreign company establish a branch? | business_registration |
| What is the corporate income tax rate? | taxation |
| Requirements for a foreign founder? | business_registration |
| Work pass for a foreign software engineer? | labor_employment |
| Obligations under Singapore's PDPA? | data_privacy |

---

## Notes

- The `chroma_db/` folder is auto-generated — **do not commit it to git**.
- Re-running `ingest.py` deletes and recreates the collection (no duplicates).
- Scanned/image-only PDFs will be skipped with a warning.
- UAE and Germany phases are planned but not yet implemented.
