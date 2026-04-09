import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime

class EngagementEngine:
    """
    Motor de Engajamento Acadêmico ARKOS 360.
    Baseado no Objetivo OE3 e OE4 do TCC.
    """
    
    def calculate_sed(self, access_logs: pd.DataFrame) -> float:
        """
        SED (Slope de Engajamento Digital): Beta da regressão linear de acessos/tempo.
        Mede a tendência de abandono silencioso.
        """
        if access_logs.empty or len(access_logs) < 2:
            return 0.0

        # Agrupa por semana para suavizar ruído diário
        access_logs['week'] = pd.to_datetime(access_logs['timestamp']).dt.isocalendar().week
        weekly_access = access_logs.groupby('week').size().reset_index(name='count')
        
        if len(weekly_access) < 2:
            return 0.0

        X = np.array(range(len(weekly_access))).reshape(-1, 1)
        y = weekly_access['count'].values
        
        model = LinearRegression().fit(X, y)
        return float(model.coef_[0])

    def calculate_engagement_score(self, access_logs: pd.DataFrame) -> float:
        """
        Calcula o índice de engajamento normalizado [0,1].
        """
        if access_logs.empty:
            return 0.0
            
        last_access = pd.to_datetime(access_logs['timestamp']).max()
        days_since = (datetime.now() - last_access.to_pydatetime()).days
        
        # Recência exponencial
        score = np.exp(-0.1 * max(0, days_since))
        return float(np.clip(score, 0, 1))
