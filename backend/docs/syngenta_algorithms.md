# Algorithm Logic Document

## For Brazil

### Product Descriptions

| Product        | Description                                                                 | Type of Crop Applicable |
|----------------|-----------------------------------------------------------------------------|-------------------------|
| Stress Buster  | Abiotic stress, allows the plants to tolerate and quickly overcome the stress, preserving yield under Cold, Heat, drought, wounding | Soybean, Corn, Cotton   |
| Nutrient Booster | Increases the efficiency of plants nutrient use.                           | Soybean, Corn           |
| Yield Booster  | Guarantees maximum productivity                                             | Soybean, Corn, Cotton   |

## For India

### Product Descriptions

| Product        | Description                                                                 | Type of Crop Applicable |
|----------------|-----------------------------------------------------------------------------|-------------------------|
| Stress Buster  | Abiotic stress, allows the plants to tolerate and quickly overcome the stress, preserving yield under Cold, Heat, drought, wounding | Rice, Wheat & Cotton    |
| Yield Booster  | Guarantees maximum productivity                                             | Rice, Wheat & Cotton    |

## Algorithms Logic

### Stress Buster

#### 1. Daytime Heat Stress Risk (Algorithm based on maximum temperatures)

Each crop has specific cardinal temperatures that define limits of growth and development. The scale will be from 0 to 9, where zero means no stress, and 9 is the maximum diurnal heat stress.

**Logic Equation:**

- Diurnal heat stress = 0 for (TMAX <= TMaxOptimum)
- Diurnal heat stress = 9 * [(TMAX - TMaxOptimum) / (TMaxLimit - TMaxOptimum)] for (TMaxOptimum < TMAX < TMaxLimit)
- Diurnal heat stress = 9 for (TMAX >= TMaxLimit)

**Where:**

- TMAX = daily maximum air temperature (ºC)
- TMaxOptimum = maximum temperature for optimum growth
- TMaxLimit = temperature when the crop does not grow anymore (zero growth)

**Crop Specific Values:**

| Crop     | TMaxOptimum | TMaxLimit |
|----------|--------------|-----------|
| Soybean  | 32           | 45        |
| Corn     | 33           | 44        |
| Cotton   | 32           | 38        |
| Rice     | 32           | 38        |
| Wheat    | 25           | 32        |

Example: Diurnal heat stress for soybean = 9 * [(TMAX - 32) / (45 - 32)]

#### 2. Nighttime Heat Stress Risk (Algorithm based on minimum temperatures)

Warm night temperatures during the flowering and other growth stages lead to yield reductions due to a high rate of cellular respiration and accelerated phenological development. The scale will be from 0 to 9, where zero means no stress, and 9 is the maximum diurnal night stress.

**Logic Equation:**

- Nighttime heat stress = 0 for (TMIN < TMinOptimum)
- Nighttime heat stress = 9 * [(TMIN - TMinOptimum) / (TMinLimit - TMinOptimum)] for (TMinOptimum ≤ TMIN < TMinLimit)
- Nighttime heat stress = 9 for (TMIN ≥ TMinLimit)

**Where:**

- TMIN = daily minimum air temperature (ºC)
- TMinOptimum = maximum daily minimum temperature for optimum growth
- TMinLimit = minimum temperature at which the crop is significantly affected by night heat stress

**Crop Specific Values:**

| Crop     | TMinOptimum | TMinLimit |
|----------|--------------|-----------|
| Soybean  | 22           | 28        |
| Corn     | 22           | 28        |
| Cotton   | 20           | 25        |
| Rice     | 22           | 28        |
| Wheat    | 15           | 20        |

Example: Diurnal night stress for soybean = 9 * [(TMIN - 22) / (28 - 22)]

- If the “Nighttime heat stress” is >9, then use 9.

#### 3. Frost Stress (Algorithm based on minimum temperatures)

Freezing temperatures prior to maturity can result in yield losses. A killing freeze occurs when temperatures dip to zero degrees Celsius for four hours or 2.2 degrees Celsius for minutes. A killing freeze can still happen with temperatures above zero degrees Celsius, especially in low and unprotected areas when there’s no wind.

**Logic Equation:**

- Frost stress = 0 for (TMIN >= TMinNoFrost)
- Frost stress = 9 * [ABS(TMIN - TMinNoFrost) / ABS(TminFrost - TMinNoFrost)] for (TMIN < TMinNoFrost)
- Frost stress = 9 for (TMIN <= TMinFrost)

**Where:**

- TMIN = daily minimum air temperature (ºC)
- TMinNoFrost = minimum temperature at which the crop is not affected by frost stress
- TminFrost = minimum temperature at which the crop is significantly affected by frost stress

**Crop Specific Values:**

| Crop     | TMinNoFrost | TminFrost |
|----------|--------------|-----------|
| Soybean  | 4            | -3        |
| Corn     | 4            | -3        |
| Cotton   | 4            | -3        |
| Rice     | NA           | NA        |
| Wheat    | NA           | NA        |

Example: Frost stress = 9 * [ABS(TMIN - 4) / ABS(-3 - 4)]

#### 4. Drought Risk

Drought risk can be computed for the previous season and predict whether the current season will be a drought risk, and recommend the biosimulate.

**Drought Index (DI) Equation:**

DI = (P - E) + SM / T

**Where:**

- P = Cumulative rainfall (mm) over a specific period (e.g., growing season)
- E = Cumulative evaporation (mm) over the same period (e.g., growing season)
- SM = Soil moisture content (mm or %) (average over the growing season)
- T = Average temperature (°C) over the period

**Interpretation of the Drought Index (DI):**

- DI > 1: No risk
- DI = 1: Medium risk
- DI < 1: Medium risk

### Yield Booster

#### 5. Yield Risk

For yield risk, you can have two approaches:

1. Gather the yield from the grower for past years and identify if the field is at risk and recommend the biosimulate to increase the yield.
2. Compute the yield risk using the formula below and recommend the biosimulate.

**Yield Risk (YR) Equation:**

YR = w1 * (GDD - GDD_opt)^2 + w2 * (P - P_opt)^2 + w3 * (pH - pH_opt)^2 + w4 * (N - N_opt)^2

**Where:**

- GDD = Actual Growing Degree Days
- GDD_opt = Optimal Growing Degree Days
- P = Actual rainfall (mm)
- P_opt = Optimal rainfall for growth (mm)
- pH = Actual soil pH
- pH_opt = Optimal soil pH
- N = Actual available nitrogen in the soil (kg/ha)
- N_opt = Optimal nitrogen availability for soybean (kg/ha)
- w1, w2, w3, w4 = Weighting factors for each variable, reflecting their relative importance

**Example Weighting Factors:**

- w1 (GDD): 0.3
- w2 (Precipitation): 0.3
- w3 (pH): 0.2
- w4 (Nitrogen): 0.2

This distribution suggests that GDD and precipitation have a slightly higher impact on yield risk than pH and nitrogen levels.

**Optimal Values for Crops:**

| Crop Name | GDD Optimal | Precipitation Optimal | pH Optimal | N Optimal |
|-----------|--------------|-----------------------|------------|-----------|
| Soybean   | 2400-3000    | 450-700 mm            | 6.0-6.8    | 0-0.026 g/kg |
| Corn      | 2700-3100    | 500-800 mm            | 6.0-6.8    | 0.077-0.154 g/kg |
| Cotton    | 2200-2600    | 700-1300 mm           | 6.0-6.5    | 0.051-0.092 g/kg |
| Rice      | 2000-2500    | 1000-1500 mm          | 5.5-6.5    | 0.051-0.103 g/kg |
| Wheat     | 2000-2500    | 1000-1500 mm          | 5.5-6.5    | 0.051-0.103 g/kg |

**Growing Degree Days (GDD) Equation:**

GDD = [(Tmax + Tmin) / 2] - Tbase

**Where:**

- Tmax = Maximum daily temperature
- Tmin = Minimum daily temperature
- Tbase = Base temperature (threshold for plant growth)

### Nutrient Booster

Nutrient biosimulants are usually recommended based on the previous year's consumption of nutrients and plan for the current seasons.

#### 6. Nitrogen Stress

The biosimulants are recommended for improving nutrient uptake and efficiency based on the Nutrient Use Efficiency (NUE).

**NUE Equation:**

NUE = (Crop yield / Nitrogen applied) * (Rainfall factor) * (Soil moisture factor)

**Where:**

- Crop Yield = Projected crop yield kg/ha
- Nitrogen applied = Nitrogen applied kg/ha
- Rainfall factor (RF): RF = 1 if rainfall is optimal, RF < 1 if rainfall is below optimal (drought conditions), RF > 1 if rainfall is above optimal (potential leaching)
- Soil moisture factor (SMF): SMF = 1 if soil moisture is optimal, SMF < 1 if soil is too dry, SMF > 1 if soil is too wet (potential denitrification)

**Example Calculation:**

- If optimal rainfall is 600 mm and actual rainfall is 500 mm: RF = 500 / 600 = 0.83
- If optimal soil moisture is 25% and actual soil moisture is 20%: SMF = 20 / 25 = 0.8

**Optimal Values for Soil Moisture and Precipitation:**

| Crop Name | Soil Moisture Optimal | Precipitation Optimal |
|-----------|------------------------|-----------------------|
| Soybean   | 50-70%                 | 450-700 mm            |
| Corn      | 50-70%                 | 500-800 mm            |
| Cotton    | 50-70%                 | 700-1300 mm           |
| Rice      | 80%                    | 1000-1500 mm          |
| Wheat     | 80%                    | 1000-1500 mm          |

#### 7. Phosphorus Stress

The biosimulants are recommended for improving nutrient uptake and efficiency based on the Phosphorus Use Efficiency (PUE).

**PUE Equation:**

PUE = (Yield / P applied) * SF (for Phosphorus)

**Where:**

- PUE = Phosphorus Use Efficiency (tonnes of crop per kg P applied, adjusted for soil factors)
- Yield = Crop yield (tonnes/ha)
- P applied = Phosphorus applied as fertilizer (kg P/ha)
- SF = Soil Factor (a value between 0 and 1)

**Example Calculation:**

- If optimal pH is 5 and actual pH is 6: pH factor (pHf) = 5 / 6 = 0.8
- If optimal rainfall is 600 mm and actual rainfall is 500 mm: Rainfall factor (RF) = 500 / 600 = 0.83
- If optimal soil moisture is 25% and actual soil moisture is 20%: Soil moisture factor (SMF) = 20 / 25 = 0.8

**Optimal Values for Soil Moisture, Precipitation, and pH:**

| Crop Name | Soil Moisture Optimal | Precipitation Optimal | pH Optimal |
|-----------|------------------------|-----------------------|------------|
| Soybean   | 50-70%                 | 450-700 mm            | 6.0-7.0    |
| Corn      | 50-70%                 | 500-800 mm            | 6.0-7.0    |
| Cotton    | 50-70%                 | 700-1300 mm           | 6.0-6.5    |
| Rice      | 80%                    | 1000-1500 mm          | 5.5-6.5    |
| Wheat     | 80%                    | 1000-1500 mm          | 6.0-7.0    |