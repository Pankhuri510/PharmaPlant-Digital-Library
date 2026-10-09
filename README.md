# PharmaPlant Digital Library — revised UI

This version keeps the interface intentionally simple and academic:
- plant cards with real plant photographs
- search + family filter
- plant detail pages
- real microscopy figures extracted from the supplied document
- expandable study sections
- AI identification prototype

The normal-appearance photographs use Wikimedia Commons files. The microscopy figures are the figures extracted from the supplied pharmacognosy document.

Run frontend:
```bash
cd frontend
npm install
npm run dev
```

Run AI backend in a second terminal:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```


Institution branding: the homepage includes the user-provided BIT Ranchi logo, Department of Pharmaceutical Sciences & Technology, and preparation credit. AI results now display one closest visual match only.
