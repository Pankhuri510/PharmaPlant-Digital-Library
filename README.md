# 🌿 PharmaPlant — Digital Pharmacognosy Library

An interactive web-based digital library designed to support the study of medicinal plants and their pharmacognostic characteristics.

**Live Website:** https://pharma-plant-digital-library.vercel.app/

## About the Project

PharmaPlant provides a structured platform for exploring medicinal plants, their biological sources, microscopic characteristics, chemical constituents, and medicinal uses.

The application brings together botanical reference information and microscopy illustrations in an accessible digital format for pharmacognosy education.

## Features

- **Medicinal Plant Library:** Browse structured reference information for medicinal plants.
- **Search and Filtering:** Search plants and filter them by botanical family.
- **Detailed Plant Profiles:** Explore biological sources, synonyms, chemical constituents, and uses.
- **Microscopy Gallery:** View reference microscopy figures and their descriptions.
- **Expandable Study Sections:** Access organized pharmacognostic information.
- **AI Identification Prototype:** Experimental image-similarity-based plant matching.

## Current Plant Collection

- Cinchona
- Cinnamon
- Clove
- Dill
- Ephedra

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, Vite, JavaScript |
| Styling | CSS |
| Backend | Python, FastAPI |
| Image Processing | PyTorch, Torchvision, Pillow |
| Data Storage | JSON |
| Frontend Hosting | Vercel |
| Version Control | Git and GitHub |

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in the terminal.

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Project Status

The digital library frontend is deployed and available online.

The AI Identification component is experimental and currently requires a separately running backend. It is not a clinically or scientifically validated herbal-drug authentication system.

## Screenshots and Demonstration

Screenshots and a screen-recorded walkthrough will be added following the next round of project improvements.

## Academic Credits

**Department of Pharmaceutical Sciences & Technology**

Prepared by:
- Dr. Anima Pandey
- Aditya Kumar Singh

## Future Enhancements

Potential improvements include interactive microscopy learning, expanded plant references, diagnostic-character comparisons, and faculty-validated specimen identification workflows.