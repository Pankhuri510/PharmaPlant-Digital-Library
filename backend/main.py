
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from pathlib import Path
import json, io, os, numpy as np

app = FastAPI(title="PharmaPlant AI Service")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

ROOT = Path(__file__).resolve().parents[1]
plants = json.loads((ROOT/"data/plants.json").read_text())

# AI approach:
# A pretrained ResNet50 is used as a visual feature extractor.
# Reference images placed in data/microscopy/ are embedded and cached.
# The uploaded image is compared with those reference embeddings.
# This is intentionally called "visual similarity", not a validated classifier.
_model = None
_transform = None
_ref = None

def load_model():
    global _model, _transform
    if _model is not None:
        return
    import torch
    from torchvision.models import resnet50, ResNet50_Weights
    weights = ResNet50_Weights.DEFAULT
    model = resnet50(weights=weights)
    model.fc = torch.nn.Identity()
    model.eval()
    _model = model
    _transform = weights.transforms()

def embed(image):
    import torch
    load_model()
    x = _transform(image).unsqueeze(0)
    with torch.no_grad():
        v = _model(x).squeeze().numpy()
    v = v / (np.linalg.norm(v) + 1e-12)
    return v

def build_reference_index():
    global _ref
    if _ref is not None:
        return _ref
    ref_dir = ROOT/"data/microscopy"
    refs = []
    for p in sorted(ref_dir.glob("*")):
        if p.suffix.lower() not in {".png",".jpg",".jpeg",".webp"}:
            continue
        try:
            img = Image.open(p).convert("RGB")
            refs.append((p.name, embed(img)))
        except Exception:
            pass
    _ref = refs
    return refs

def plant_for_filename(filename):
    low = filename.lower()
    for p in plants:
        if p["id"] in low or p["name"].lower() in low:
            return p
    return None

@app.get("/health")
def health():
    return {"status":"ok","reference_images":len(build_reference_index())}

@app.post("/identify")
async def identify(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400, "Please upload an image.")
    data = await file.read()
    try:
        img = Image.open(io.BytesIO(data)).convert("RGB")
    except Exception:
        raise HTTPException(400, "The uploaded file is not a readable image.")

    refs = build_reference_index()
    if not refs:
        # Still return a useful response if the user has not yet added reference images.
        return {
            "message":"Reference set is not configured yet.",
            "matches":[],
            "next_step":"Place microscopy reference images in data/microscopy/ and restart the backend."
        }

    q = embed(img)
    scores = []
    for filename, vector in refs:
        score = float(np.dot(q, vector))
        p = plant_for_filename(filename)
        if p:
            scores.append((p, score))
    # If filenames don't contain plant names, aggregate all known records conservatively.
    if not scores:
        return {"message":"Reference images were found, but they need plant names in their filenames.",
                "matches":[]}

    best = {}
    for p,s in scores:
        best[p["id"]] = max(best.get(p["id"], -1), s)
    ranked = sorted(best.items(), key=lambda x:x[1], reverse=True)
    by_id = {p["id"]:p for p in plants}
    pid, score = ranked[0]
    p = by_id[pid]
    match = {"plant":p["name"],"family":p["family"],"similarity":round(max(0,min(100,(score+1)*50)),1)}
    return {"message":"AI identification result","matches":[match]}
