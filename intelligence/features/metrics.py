import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

class AcademicFeatures:
    """
    Implementação baseada no OE3 e OE4 do TCC ARKOS 360.
    Foco: Slope de Engajamento Digital (SED)
    """
    def calculate_sed(self, student_access_history: pd.DataFrame) -> float:
        """
        SED_i = β̂₁ da regressão linear: acessosᵢ ~ tempo
        Queda sistemática indica abandono silencioso iminente.
        """
        if student_access_history.empty or len(student_access_history) < 2:
            return 0.0

        # Prepara X (tempo em semanas) e y (contagem de acessos)
        X = np.array(range(len(student_access_history))).reshape(-1, 1)
        y = student_access_history['access_count'].values
        
        model = LinearRegression().fit(X, y)
        return float(model.coef_[0])

class FinancialFeatures:
    """
    Implementação baseada na dimensão Financeira do Quadro 4.1 do TCC.
    """
    def calculate_svf(self, accumulated_debt: float, monthly_fee: float) -> float:
        """
        SVF_i = (Débitos_acumulados_i / Mensalidade_i) × 100
        Mede a proporção do valor total em atraso.
        """
        if monthly_fee <= 0:
            return 0.0
        return (accumulated_debt / monthly_fee) * 100

class InstitutionalFeatures:
    """
    Implementação do Indicador de Pertencimento Institucional (IPI-e)
    """
    def calculate_ipi_e(self, events_attended: int) -> float:
        """
        IPI-eᵢ = log(1 + eventos_comparecidos_semestre_i)
        Proxy para o nível de vínculo social/institucional.
        """
        return float(np.log1p(events_attended))
