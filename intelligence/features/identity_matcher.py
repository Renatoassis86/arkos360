import pandas as pd
from difflib import SequenceMatcher

class IdentityMatcher:
    """
    Implementação baseada no USR (Unified Student Record).
    Realiza o De-Para entre Prime e Sponte conforme OE1 do TCC.
    """
    
    def __init__(self, threshold: float = 0.85):
        self.threshold = threshold

    def normalize_name(self, name: str) -> str:
        """Normalização básica para matching."""
        if not name: return ""
        return " ".join(name.lower().strip().split())

    def calculate_similarity(self, a: str, b: str) -> float:
        """Calcula a similaridade de Levenshtein entre dois nomes."""
        return SequenceMatcher(None, a, b).ratio()

    def find_matches(self, prime_df: pd.DataFrame, sponte_df: pd.DataFrame):
        """
        Tenta encontrar alunos correspondentes via CPF ou Nome + Data Nasc.
        """
        matches = []
        
        # 1. Matching Determinístico por CPF
        # (Lógica simplificada para demonstração)
        
        for _, p_row in prime_df.iterrows():
            # Exemplo de lógica de matching:
            # Se CPF existir em ambos, link imediato.
            # Senão, usa Fuzzy Matching no nome + nascimento.
            pass
            
        return matches
