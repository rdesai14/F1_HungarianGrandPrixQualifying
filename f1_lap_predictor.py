import fastf1
import requests
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer

fastf1.Cache.enable_cache('cache')

def fetch_f1_data(year, round_number):
    """Fetch data using official F1 API via FastF1"""
    try:
      
        quali = fastf1.get_session(year, round_number, 'Q')
        quali.load()
        
      
        results = quali.results[['DriverNumber', 'FullName', 'TeamName', 'Q1', 'Q2', 'Q3']]
        
    
        results = results.rename(columns={'FullName': 'Driver'})
        
      
        for col in ['Q1', 'Q2', 'Q3']:
            results[col + '_sec'] = results[col].apply(
                lambda x: x.total_seconds() if pd.notnull(x) else None
            )
        
       
        print("\nQualifying Results Structure:")
        print(results.head())
        
        return results
    except Exception as e:
        print(f"Error fetching data: {e}")
        print("DataFrame columns available:", quali.results.columns.tolist())
        return None


def convert_time_to_seconds(time_str):
    if pd.isna(time_str):
        return None
    try:
       
        if ':' in time_str:
            minutes, seconds = time_str.split(':')
            return float(minutes) * 60 + float(seconds)
     
        else:
            return float(time_str)
    except (ValueError, TypeError) as e:
        print(f"Warning: Could not convert time: {time_str}, Error: {e}")
        return None

def clean_data(df):

    print("\nBefore cleaning:")
    print(df[['Driver', 'Q1', 'Q2', 'Q3']].head())
    
    df['Q1_sec'] = df['Q1'].apply(convert_time_to_seconds)
    df['Q2_sec'] = df['Q2'].apply(convert_time_to_seconds)
    df['Q3_sec'] = df['Q3'].apply(convert_time_to_seconds)
    
    print("\nAfter cleaning:")
    print(df[['Driver', 'Q1_sec', 'Q2_sec', 'Q3_sec']].head())
    
    return df.dropna()


def visualize_data(df):
    sns.boxplot(data=df[['Q1_sec', 'Q2_sec', 'Q3_sec']])
    plt.title('Qualifying Lap Times (seconds)')
    plt.ylabel('Lap Time (seconds)')
    plt.show()


def train_and_evaluate(df):
    X = df[['Q1_sec', 'Q2_sec']]
    y = df['Q3_sec']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = LinearRegression()
    model.fit(X_train, y_train)

   
    predictions = model.predict(X)
    
   
    results_df = df[['Driver', 'TeamName', 'Q1_sec', 'Q2_sec', 'Q3_sec']].copy()
    results_df['Predicted_Q3'] = predictions
    results_df['Difference'] = results_df['Predicted_Q3'] - results_df['Q3_sec']
    
    
    results_df = results_df.sort_values('Predicted_Q3')
    

    print("\nPredicted Q3 Rankings:")
    print("=" * 70)
    print(f"{'Position':<10}{'Driver':<15}{'Team':<20}{'Predicted Time':<15}{'Actual Time':<15}")
    print("-" * 70)
    
    for idx, row in results_df.iterrows():
        pred_time = f"{row['Predicted_Q3']:.3f}"
        actual_time = f"{row['Q3_sec']:.3f}" if not pd.isna(row['Q3_sec']) else "N/A"
        print(f"{results_df.index.get_loc(idx)+1:<10}{row['Driver']:<15}{row['TeamName']:<20}{pred_time:<15}{actual_time:<15}")

    
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print("\nModel Performance Metrics:")
    print(f'Mean Absolute Error: {mae:.2f} seconds')
    print(f'R^2 Score: {r2:.2f}')

def fetch_recent_data():
    """Fetch data from recent races using FastF1"""
    all_data = []
    
   
    current_year = 2025
    for round_num in range(1, 14):  # First 4 races of 2025
        print(f"Fetching data for {current_year} round {round_num}...")
        df = fetch_f1_data(current_year, round_num)
        if df is not None:
            df['Year'] = current_year
            df['Round'] = round_num
            all_data.append(df)
    

    print("Fetching 2024 Hungarian GP data...")
    hungarian_2024 = fetch_f1_data(2024, 13)
    if hungarian_2024 is not None:
        hungarian_2024['Year'] = 2024
        hungarian_2024['Round'] = 13
        all_data.append(hungarian_2024)
    
    return all_data

def apply_performance_factors(predictions_df):
    """Apply 2025-specific performance factors"""
    base_time = 76  # in seconds
    
    team_factors = {
        'Red Bull Racing': 0.996,    # -0.3s from base
        'Ferrari': 0.998,          # -0.2s from base
        'McLaren': 0.995,          # -0.15s from base
        'Mercedes': 0.998,         # -0.15s from base
        'Aston Martin': 1.002,     # +0.1s from base
        'RB': 1.003,              # +0.2s from base
        'Williams': 1.004,         # +0.3s from base
        'Haas F1 Team': 1.007,     # +0.4s from base
        'Kick Sauber': 1.010,      # +0.4s from base (Audi development)
        'Alpine': 1.006,           # +0.5s from base
    }
    
    driver_factors = {
        'Max Verstappen': 0.996,     # -0.2s (exceptional)
        'Charles Leclerc': 0.997,    # -0.1s (very strong qualifier)
        'Carlos Sainz': 1.001,       # -0.1s (very consistent)
        'Lando Norris': 0.995,       # -0.1s (McLaren leader)
        'Oscar Piastri': 0.995,      # Base time (strong)
        'Gabriel Bortoleto': 1.005,       # Base time
        'Lewis Hamilton': 1.001,     # Base time
        'George Russell': 0.999,     # Base time
        'Fernando Alonso': 1.002,    # Base time
        'Lance Stroll': 1.003,       # +0.1s
        'Alex Albon': 1.001,         # +0.1s
        'Isack Hadjar': 1.003,   # +0.1s
        'Yuki Tsunoda': 1.004,       # +0.2s
        'Liam Lawson': 1.002,    # +0.2s
        'Oliver Bearman': 1.003,        # +0.3s
        'Franco Colapinto': 1.005,    # +0.3s
        'Nico Hulkenberg': 1.002,    # +0.3s
        'Kimi Antonelli': 1.000,     # +0.4s
        'Pierre Gasly': 1.003,       # +0.4s
        'Esteban Ocon': 1.002,       # +0.4s
    }
    
    
    for idx, row in predictions_df.iterrows():
        team_factor = team_factors.get(row['Team'], 1.005)
        driver_factor = driver_factors.get(row['Driver'], 1.002)
        

        base_prediction = base_time * team_factor * driver_factor
        

        random_variation = np.random.uniform(-0.1, 0.1)
        predictions_df.loc[idx, 'Predicted_Q3'] = base_prediction + random_variation
    
    return predictions_df

def predict_japanese_gp(model, latest_data):
    """Predict Q3 times for Japanese GP 2025"""

    driver_teams = {
        'Max Verstappen': 'Red Bull Racing',
        'Yuki Tsunoda': 'Red Bull Racing',
        'Charles Leclerc': 'Ferrari',
        'Lewis Hamilton': 'Ferrari',
        'Kimi Antonelli': 'Mercedes',
        'George Russell': 'Mercedes',
        'Lando Norris': 'McLaren',
        'Oscar Piastri': 'McLaren',
        'Fernando Alonso': 'Aston Martin',
        'Lance Stroll': 'Aston Martin',
        'Liam Lawson ': 'RB',
        'Isack Hadjar': 'RB',
        'Alexander Albon': 'Williams',
        'Carlos Sainz': 'Williams',
        'Nico Hulkenburg': 'Kick Sauber',
        'Gabriel Bortoleto': 'Kick Sauber',
        'Oliver Bearman': 'Haas F1 Team',
        'Esteban Ocon': 'Haas F1 Team',
        'Pierre Gasly': 'Alpine',
        'Franco Colopinto': 'Alpine'
    }
    

    results_df = pd.DataFrame(list(driver_teams.items()), columns=['Driver', 'Team'])
    

    results_df = apply_performance_factors(results_df)

    results_df = results_df.sort_values('Predicted_Q3')
    

    print("\nHungarian GP 2025 Qualifying Predictions:")
    print("=" * 100)
    print(f"{'Position':<10}{'Driver':<20}{'Team':<25}{'Predicted Q3':<15}")
    print("-" * 100)
    
    for idx, row in results_df.iterrows():
        print(f"{results_df.index.get_loc(idx)+1:<10}"
              f"{row['Driver']:<20}"
              f"{row['Team']:<25}"
              f"{row['Predicted_Q3']:.3f}s")


if __name__ == "__main__":
    print("Initializing enhanced F1 prediction model...")

    all_data = fetch_recent_data()
    
    if all_data:
  
        combined_df = pd.concat(all_data, ignore_index=True)
        
        valid_data = combined_df.dropna(subset=['Q1_sec', 'Q2_sec', 'Q3_sec'], how='all')

        imputer = SimpleImputer(strategy='median')
        

        X = valid_data[['Q1_sec', 'Q2_sec']]
        y = valid_data['Q3_sec']
        
 
        X_clean = pd.DataFrame(imputer.fit_transform(X), columns=X.columns)
        y_clean = pd.Series(imputer.fit_transform(y.values.reshape(-1, 1)).ravel())
        
        # Create a cleaned dataframe for the train_and_evaluate function
        cleaned_data = valid_data.copy()
        cleaned_data[['Q1_sec', 'Q2_sec', 'Q3_sec']] = pd.DataFrame(
            imputer.fit_transform(valid_data[['Q1_sec', 'Q2_sec', 'Q3_sec']]),
            columns=['Q1_sec', 'Q2_sec', 'Q3_sec'],
            index=valid_data.index
        )
        
        # Use the train_and_evaluate function
        train_and_evaluate(cleaned_data)
        
        # Train model for predictions
        model = LinearRegression()
        model.fit(X_clean, y_clean)
        
        predict_japanese_gp(model, cleaned_data)
    else:
        print("Failed to fetch F1 data")
