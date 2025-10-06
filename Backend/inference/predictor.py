import os, json
from typing import List, Dict, Any, Optional, Tuple
import torch
import torch.nn.functional as F
import numpy as np
from pathlib import Path
from scipy.interpolate import interp1d
import re
from functools import lru_cache

# Fix module import paths
import sys
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT)) 

from core.config import settings 
from inference.model_def import CNN_BiLSTM_Attn 
from inference.tokenizer import simple_tokenize 

# Global constants
POS_LABEL = 1 
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
PAD_IDX = settings.PAD_IDX

class Predictor:
    def __init__(self, model_path: str, vocab_path: str, threshold_path: str):
        
        # --- Logic การโหลด Vocab (ยืดหยุ่น) ---
        print(f"Loading vocab from: {vocab_path}")
        with open(vocab_path, 'r', encoding='utf-8') as f:
            loaded_vocab = json.load(f)

        if isinstance(loaded_vocab, list):
            self.word_to_ix = {token: i for i, token in enumerate(loaded_vocab)}
        elif isinstance(loaded_vocab, dict):
            if 'word_to_ix' in loaded_vocab: self.word_to_ix = loaded_vocab['word_to_ix']
            elif 'itos' in loaded_vocab: self.word_to_ix = {token: i for i, token in enumerate(loaded_vocab['itos'])}
            elif all(isinstance(v, int) for v in loaded_vocab.values()): self.word_to_ix = loaded_vocab
            else: raise ValueError("Unsupported vocabulary dictionary format.")
        else:
            raise ValueError(f"Unsupported vocabulary file format: {type(loaded_vocab)}")

        if not hasattr(self, 'word_to_ix') or not self.word_to_ix:
            raise RuntimeError("Failed to correctly parse the vocabulary file.")
            
        self.unk_idx = self.word_to_ix.get(settings.UNK_TOKEN, 1)

        # ✅ --- START: แก้ไข Logic การโหลด Threshold ---
        print(f"Loading threshold from: {threshold_path}")
        try:
            with open(threshold_path, 'r') as f:
                thresh_data = json.load(f)
                # ทำให้รองรับทั้ง key 'optimal_threshold' และ 'threshold'
                if 'optimal_threshold' in thresh_data:
                    self.threshold = thresh_data['optimal_threshold']
                elif 'threshold' in thresh_data:
                    self.threshold = thresh_data['threshold']
                else:
                    raise KeyError("Neither 'optimal_threshold' nor 'threshold' key found.")
            print(f"INFO: Using optimal threshold: {self.threshold}")
        except (FileNotFoundError, KeyError) as e:
            self.threshold = settings.DEFAULT_THRESHOLD
            print(f"Warning: Could not load optimal threshold ({e}). Using default: {self.threshold}")
        # ✅ --- END: แก้ไข Logic การโหลด Threshold ---

        # --- สร้างสถาปัตยกรรมโมเดล ---
        print("Initializing model architecture...")
        self.model = CNN_BiLSTM_Attn(
            vocab_size=len(self.word_to_ix),
            emb_dim=settings.EMB_DIM,
            cnn_channels=settings.CNN_CHANNELS,
            kernel_sizes=settings.KERNEL_SIZES,
            lstm_hidden=settings.LSTM_HIDDEN,
            lstm_layers=settings.LSTM_LAYERS,
            bidir=settings.BIDIR,
            dropout=settings.DROPOUT,
        ).to(DEVICE)
        
        # --- Logic การโหลด Model Weights ---
        print(f"Loading model checkpoint from: {model_path}")
        checkpoint = torch.load(model_path, map_location=DEVICE)
        
        if isinstance(checkpoint, dict) and 'model_state' in checkpoint:
            state_dict = checkpoint['model_state']
            print("INFO: Extracted 'model_state' from checkpoint file.")
        else:
            state_dict = checkpoint
            print("INFO: Checkpoint file is assumed to be a raw state_dict.")

        self.model.load_state_dict(state_dict)
        self.model.eval()

    def _encode_and_pad(self, text: str) -> Tuple[torch.Tensor, List[str]]:
        tokens = simple_tokenize(text)
        if not tokens:
            return None, []
            
        indexed = [self.word_to_ix.get(t, self.unk_idx) for t in tokens]
        # Ensure minimum length to satisfy largest CNN kernel size
        try:
            from core.config import settings as _settings
            min_len = max(_settings.KERNEL_SIZES)
        except Exception:
            min_len = 3
        if len(indexed) < min_len:
            pad_count = min_len - len(indexed)
            indexed = indexed + [PAD_IDX] * pad_count
        tensor = torch.LongTensor(indexed).unsqueeze(0).to(DEVICE)
        return tensor, tokens

    def _extract_clues(self, alpha: torch.Tensor, tokens: List[str]) -> List[Dict[str, Any]]:
        if not tokens: return []
        scores = alpha.squeeze(0).cpu().numpy()
        
        if len(scores) != len(tokens):
            x_orig = np.linspace(0, 1, len(scores))
            x_new = np.linspace(0, 1, len(tokens))
            scores = np.interp(x_new, x_orig, scores)

        # ✅ ปรับปรุง: เลือกคำสำคัญจากทุกคำที่มีคะแนนสูง
        # ไม่จำกัดจำนวนคำ แต่เลือกคำที่มีคะแนนสูงสุด
        clues = []
        
        # สร้าง list ของ (index, score, token) และเรียงตามคะแนน
        token_scores = [(i, scores[i], tokens[i]) for i in range(len(tokens))]
        token_scores.sort(key=lambda x: x[1], reverse=True)  # เรียงตามคะแนนจากสูงไปต่ำ
        
        # ✅ กรองคำหยุดที่สั้นมากและไม่มีความหมาย
        stop_words = [
    'the', 'and', 'or', 'but', 'if', 'while', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can',
    'this', 'that', 'these', 'those', 'then', 'there', 'here', 'when', 'where', 'why', 'how',
    'it', 'its', 'i', 'you', 'he', 'she', 'they', 'them', 'we', 'us', 'me', 'my', 'your', 'his', 'her', 'their', 'our',
    'from', 'as', 'about', 'into', 'up', 'down', 'out', 'over', 'under', 'again', 'further', 'once',
    'just', 'only', 'too', 'very', 'so', 'than', 'also', 'such', 'both', 'each', 'other', 'any', 'all', 'some', 'no', 'nor', 'not',
    'because', 'until', 'before', 'after', 'during', 'above', 'below', 'between', 'through', 'off',
    'own', 'same', 'more', 'most', 'few', 'less', 'many', 'much']

        # เพิ่มคำแบบพิมพ์ใหญ่ทั้งหมดด้วย
        stop_words += [word.capitalize() for word in stop_words]
        stop_words += [word.upper() for word in stop_words]

        
        # เลือกคำสำคัญไม่เกิน 3 คำ
        count = 0
        for i, score, token in token_scores:
            if count >= 3:  # จำกัดไม่เกิน 3 คำ
                break
                
            if len(token) >= 2 and token.lower() not in stop_words:
                clues.append({"token": token, "score": round(float(score), 4)})
                count += 1
        
        # เรียงลำดับตามคะแนนจากสูงไปต่ำ
        clues.sort(key=lambda x: x["score"], reverse=True)
        
        # ✅ จำกัดให้เหลือไม่เกิน 3 คำสำคัญที่สุด
        return clues[:3]

    def predict(self, text: str) -> Dict[str, Any]:
        if not text.strip():
            return {"prediction": 0, "score": 0.0, "clues": []}

        input_tensor, actual_tokens = self._encode_and_pad(text)
        if input_tensor is None:
            return {"prediction": 0, "score": 0.0, "clues": []}
        
        with torch.no_grad():
            logits, alpha, min_t = self.model(input_tensor)
        
        probs = F.softmax(logits, dim=1)
        score = probs[0, POS_LABEL].item() 
        prediction = 1 if score >= self.threshold else 0
        
        clues = self._extract_clues(alpha, actual_tokens)
        
        return {"prediction": prediction, "score": score, "clues": clues}

@lru_cache(maxsize=1)
def get_predictor() -> Predictor:
    """ Returns a cached instance of the ML Predictor (Singleton). """
    print("INFO: Initializing ML Predictor...")
    try:
        predictor_instance = Predictor(
            model_path=settings.MODEL_PATH, 
            vocab_path=settings.VOCAB_PATH, 
            threshold_path=settings.THRESH_PATH
        )
        print("INFO: ML Predictor initialized successfully.")
        return predictor_instance
    except Exception as e:
        print(f"CRITICAL ERROR: Failed to initialize Predictor: {e}")
        raise RuntimeError("Could not initialize the ML model predictor.")

