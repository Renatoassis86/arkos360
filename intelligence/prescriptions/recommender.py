from typing import List, Dict

class PrescriptionEngine:
    """
    Motor que traduz predições de risco em recomendações de ações (Apoio à decisão).
    """
    def __init__(self):
        # Mapeamento básico de regras de negócio (Heurísticas antes do ML Causal)
        self.rules = [
            {"condition": "financial_risk > 0.8", "action": "Negociação de Débito"},
            {"condition": "engagement_score < 0.3", "action": "Apoio Psicopedagógico"},
            {"condition": "grade_average < 5.0", "action": "Monitoria de Disciplina"}
        ]

    def prescribe(self, student_data: Dict) -> List[Dict]:
        """
        Analisa os dados do aluno e prescreve as melhores ações.
        Em versões futuras, será substituído por um modelo de Persuasão/Uplift.
        """
        prescriptions = []
        
        # Lógica de recomendação baseada em scores
        if student_data.get('risk_score', 0) > 0.7:
            if student_data.get('financial_delay', 0) > 0:
                prescriptions.append({
                    "action": "Bolsa de Retenção Especial",
                    "priority": "High",
                    "rational": "Alto risco combinado com atraso financeiro."
                })
            else:
                prescriptions.append({
                    "action": "Apoio Psicopedagógico",
                    "priority": "Medium",
                    "rational": "Risco elevado sem atraso financeiro aparente (possível evasão acadêmica)."
                })
        
        return prescriptions
