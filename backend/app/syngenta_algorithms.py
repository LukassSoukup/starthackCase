def daytime_heat_stress(tmax, crop):
    """
    Calculate daytime heat stress for a specific crop based on maximum temperature.

    Args:
        tmax (float): Daily maximum air temperature in Celsius
        crop (str): Crop type ('soybean', 'corn', 'cotton', 'rice', or 'wheat')

    Returns:
        float: Heat stress score from 0 to 9, where 0 is no stress and 9 is maximum stress
    """
    # Define crop-specific temperature thresholds
    crop_thresholds = {
        "soybean": {"tmax_optimum": 32, "tmax_limit": 45},
        "corn": {"tmax_optimum": 33, "tmax_limit": 44},
        "cotton": {"tmax_optimum": 32, "tmax_limit": 38},
        "rice": {"tmax_optimum": 32, "tmax_limit": 38},
        "wheat": {"tmax_optimum": 25, "tmax_limit": 32},
    }

    tmax_optimum = crop_thresholds[crop]["tmax_optimum"]
    tmax_limit = crop_thresholds[crop]["tmax_limit"]

    # Apply heat stress logic
    if tmax <= tmax_optimum:
        return 0
    elif tmax >= tmax_limit:
        return 9
    else:
        return 9 * (tmax - tmax_optimum) / (tmax_limit - tmax_optimum)


def nighttime_heat_stress(tmin, crop):
    """
    Calculate nighttime heat stress for a specific crop based on minimum temperature.

    Args:
        tmin (float): Daily minimum air temperature in Celsius
        crop (str): Crop type ('soybean', 'corn', 'cotton', 'rice', or 'wheat')

    Returns:
        float: Nighttime heat stress score from 0 to 9, where 0 is no stress and 9 is maximum stress
    """
    # Define crop-specific temperature thresholds
    crop_thresholds = {
        "soybean": {"tmin_optimum": 22, "tmin_limit": 28},
        "corn": {"tmin_optimum": 22, "tmin_limit": 28},
        "cotton": {"tmin_optimum": 20, "tmin_limit": 25},
        "rice": {"tmin_optimum": 22, "tmin_limit": 28},
        "wheat": {"tmin_optimum": 15, "tmin_limit": 20},
    }

    tmin_optimum = crop_thresholds[crop]["tmin_optimum"]
    tmin_limit = crop_thresholds[crop]["tmin_limit"]

    # Apply nighttime heat stress logic
    if tmin < tmin_optimum:
        return 0
    elif tmin >= tmin_limit:
        return 9
    else:
        stress = 9 * (tmin - tmin_optimum) / (tmin_limit - tmin_optimum)
        # Cap at 9 if the result is greater than 9
        return min(stress, 9)


def frost_stress(tmin, crop):
    """
    Calculate frost stress for a specific crop based on minimum temperature.

    Args:
        tmin (float): Daily minimum air temperature in Celsius
        crop (str): Crop type ('soybean', 'corn', 'cotton', 'rice', or 'wheat')

    Returns:
        float: Frost stress score from 0 to 9, where 0 is no stress and 9 is maximum stress
        Returns None for crops where frost stress is not applicable (rice, wheat)
    """
    # Define crop-specific temperature thresholds
    crop_thresholds = {
        "soybean": {"tmin_no_frost": 4, "tmin_frost": -3},
        "corn": {"tmin_no_frost": 4, "tmin_frost": -3},
        "cotton": {"tmin_no_frost": 4, "tmin_frost": -3},
        "rice": None,  # Not applicable
        "wheat": None,  # Not applicable
    }

    if crop_thresholds[crop] is None:
        return None

    tmin_no_frost = crop_thresholds[crop]["tmin_no_frost"]
    tmin_frost = crop_thresholds[crop]["tmin_frost"]

    # Apply frost stress logic
    if tmin >= tmin_no_frost:
        return 0
    elif tmin <= tmin_frost:
        return 9
    else:
        return 9 * (abs(tmin - tmin_no_frost) / abs(tmin_frost - tmin_no_frost))


def drought_index(precipitation, evaporation, soil_moisture, temperature):
    """
    Calculate drought index using precipitation, evaporation, soil moisture, and temperature.

    Args:
        precipitation (float): Cumulative rainfall in mm over a specific period
        evaporation (float): Cumulative evaporation in mm over the same period
        soil_moisture (float): Soil moisture content in mm or %
        temperature (float): Average temperature in Celsius over the period

    Returns:
        float: Drought Index (DI)
        DI > 1: No risk
        DI = 1: Medium risk
        DI < 1: Medium risk
    """
    # Avoid division by zero
    if temperature == 0:
        raise ValueError("Temperature cannot be zero for drought index calculation")

    return (precipitation - evaporation + soil_moisture) / temperature


def get_optimal_values(crop):
    """
    Get optimal growing condition values for a specific crop.

    Args:
        crop (str): Crop type ('soybean', 'corn', 'cotton', 'rice', or 'wheat')

    Returns:
        dict: Dictionary containing optimal values for growing conditions
    """
    crop_optimal_values = {
        "soybean": {
            "gdd_opt": (2400, 3000),
            "precipitation_opt": (450, 700),
            "ph_opt": (6.0, 6.8),
            "nitrogen_opt": (0, 0.026),
            "soil_moisture_opt": (50, 70),
        },
        "corn": {
            "gdd_opt": (2700, 3100),
            "precipitation_opt": (500, 800),
            "ph_opt": (6.0, 6.8),
            "nitrogen_opt": (0.077, 0.154),
            "soil_moisture_opt": (50, 70),
        },
        "cotton": {
            "gdd_opt": (2200, 2600),
            "precipitation_opt": (700, 1300),
            "ph_opt": (6.0, 6.5),
            "nitrogen_opt": (0.051, 0.092),
            "soil_moisture_opt": (50, 70),
        },
        "rice": {
            "gdd_opt": (2000, 2500),
            "precipitation_opt": (1000, 1500),
            "ph_opt": (5.5, 6.5),
            "nitrogen_opt": (0.051, 0.103),
            "soil_moisture_opt": (80, 80),
        },
        "wheat": {
            "gdd_opt": (2000, 2500),
            "precipitation_opt": (1000, 1500),
            "ph_opt": (5.5, 6.5),
            "nitrogen_opt": (0.051, 0.103),
            "soil_moisture_opt": (80, 80),
        },
    }

    crop = crop.lower()
    if crop not in crop_optimal_values:
        raise ValueError(
            f"Crop '{crop}' not supported. Choose from: {list(crop_optimal_values.keys())}"
        )

    return crop_optimal_values[crop]


def growing_degree_days(tmax, tmin, tbase):
    """
    Calculate Growing Degree Days (GDD) for a given day.

    Args:
        tmax (float): Maximum daily temperature in Celsius
        tmin (float): Minimum daily temperature in Celsius
        tbase (float): Base temperature (threshold for plant growth) in Celsius

    Returns:
        float: Growing Degree Days for the day
    """
    avg_temp = (tmax + tmin) / 2
    return max(0, avg_temp - tbase)


def yield_risk(gdd, precipitation, ph, nitrogen, crop):
    """
    Calculate yield risk based on growing conditions compared to optimal conditions.

    Args:
        gdd (float): Actual Growing Degree Days
        precipitation (float): Actual rainfall in mm
        ph (float): Actual soil pH
        nitrogen (float): Actual available nitrogen in the soil (g/kg)

    Returns:
        float: Yield Risk score (higher is worse)
    """

    optimal_values = get_optimal_values(crop)

    # Convert ranges to midpoints for calculation
    gdd_opt_mid = (optimal_values["gdd_opt"][0] + optimal_values["gdd_opt"][1]) / 2
    precipitation_opt_mid = (
        optimal_values["precipitation_opt"][0] + optimal_values["precipitation_opt"][1]
    ) / 2
    ph_opt_mid = (optimal_values["ph_opt"][0] + optimal_values["ph_opt"][1]) / 2
    nitrogen_opt_mid = (
        optimal_values["nitrogen_opt"][0] + optimal_values["nitrogen_opt"][1]
    ) / 2

    # Weighting factors
    w1, w2, w3, w4 = 0.3, 0.3, 0.2, 0.2

    # Calculate yield risk
    return (
        w1 * (gdd - gdd_opt_mid) ** 2
        + w2 * (precipitation - precipitation_opt_mid) ** 2
        + w3 * (ph - ph_opt_mid) ** 2
        + w4 * (nitrogen - nitrogen_opt_mid) ** 2
    )


def calculate_rainfall_factor(actual_rainfall, crop):
    """
    Calculate rainfall factor for nutrient use efficiency.

    Args:
        actual_rainfall (float): Actual rainfall in mm
        crop (str): Crop type ('soybean', 'corn', 'cotton', 'rice', or 'wheat')

    Returns:
        float: Rainfall factor
    """
    optimal_values = get_optimal_values(crop)
    optimal_rainfall_min, optimal_rainfall_max = optimal_values["precipitation_opt"]
    optimal_rainfall_avg = (optimal_rainfall_min + optimal_rainfall_max) / 2

    # Avoid division by zero
    if optimal_rainfall_avg == 0:
        return 1

    return actual_rainfall / optimal_rainfall_avg


def calculate_soil_moisture_factor(actual_soil_moisture, crop):
    """
    Calculate soil moisture factor for nutrient use efficiency.

    Args:
        actual_soil_moisture (float): Actual soil moisture percentage
        crop (str): Crop type ('soybean', 'corn', 'cotton', 'rice', or 'wheat')

    Returns:
        float: Soil moisture factor
    """
    optimal_values = get_optimal_values(crop)
    optimal_moisture_min, optimal_moisture_max = optimal_values["soil_moisture_opt"]
    optimal_moisture_avg = (optimal_moisture_min + optimal_moisture_max) / 2

    # Avoid division by zero
    if optimal_moisture_avg == 0:
        return 1

    return actual_soil_moisture / optimal_moisture_avg


def nitrogen_use_efficiency(
    crop_yield, nitrogen_applied, actual_rainfall, actual_soil_moisture, crop
):
    """
    Calculate Nitrogen Use Efficiency (NUE).

    Args:
        crop_yield (float): Projected crop yield in kg/ha
        nitrogen_applied (float): Nitrogen applied in kg/ha
        actual_rainfall (float): Actual rainfall in mm
        actual_soil_moisture (float): Actual soil moisture percentage
        crop (str): Crop type ('soybean', 'corn', 'cotton', 'rice', or 'wheat')

    Returns:
        float: Nitrogen Use Efficiency
    """
    # Avoid division by zero
    if nitrogen_applied == 0:
        raise ValueError("Nitrogen applied cannot be zero for NUE calculation")

    rainfall_factor = calculate_rainfall_factor(actual_rainfall, crop)
    soil_moisture_factor = calculate_soil_moisture_factor(actual_soil_moisture, crop)

    return (crop_yield / nitrogen_applied) * rainfall_factor * soil_moisture_factor


def phosphorus_use_efficiency(
    crop_yield,
    phosphorus_applied,
    actual_ph,
    actual_rainfall,
    actual_soil_moisture,
    crop,
):
    """
    Calculate Phosphorus Use Efficiency (PUE).

    Args:
        crop_yield (float): Crop yield in tonnes/ha
        phosphorus_applied (float): Phosphorus applied as fertilizer in kg P/ha
        actual_ph (float): Actual soil pH
        actual_rainfall (float): Actual rainfall in mm
        actual_soil_moisture (float): Actual soil moisture percentage
        crop (str): Crop type ('soybean', 'corn', 'cotton', 'rice', or 'wheat')

    Returns:
        float: Phosphorus Use Efficiency
    """
    # Avoid division by zero
    if phosphorus_applied == 0:
        raise ValueError("Phosphorus applied cannot be zero for PUE calculation")

    optimal_values = get_optimal_values(crop)
    optimal_ph_min, optimal_ph_max = optimal_values["ph_opt"]
    optimal_ph_avg = (optimal_ph_min + optimal_ph_max) / 2

    # Calculate soil factor components
    ph_factor = optimal_ph_avg / actual_ph if actual_ph > 0 else 1
    rainfall_factor = calculate_rainfall_factor(actual_rainfall, crop)
    soil_moisture_factor = calculate_soil_moisture_factor(actual_soil_moisture, crop)

    # Combined soil factor
    soil_factor = (ph_factor + rainfall_factor + soil_moisture_factor) / 3

    return (crop_yield / phosphorus_applied) * soil_factor
