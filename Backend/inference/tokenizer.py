# inference/tokenizer.py
# -*- coding: utf-8 -*-
import re
from core.config import settings 
from typing import List

def simple_tokenize(text: str) -> List[str]:
    """ Tokenizer function to preprocess text based on model training settings. """
    if text is None: return []
    s = str(text)
    
    # ใช้ค่า LOWERCASE จาก settings
    if settings.LOWERCASE: 
        s = s.lower() 
        
    # ลบ HTML tags และ URLs
    s = re.sub(r"<.*?>|https?://\S+|www\.\S+", " ", s)
    
    # จัดการช่องว่างและตัดขอบ
    s = re.sub(r"\s+", " ", s).strip()
    
    # ✅ แก้ไข: รองรับภาษาไทยและอังกฤษ
    # [a-zA-Z0-9_\u0E00-\u0E7F]+ คือคำปกติ (รวมตัวอักษรไทย) | [^\s\w] คือสัญลักษณ์
    tokens = re.findall(r"[a-zA-Z0-9_\u0E00-\u0E7F]+|[^()\s\w]", s)
    
    return tokens
