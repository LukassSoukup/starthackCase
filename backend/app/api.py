from datetime import date, timedelta
from syngenta.syngenta_api import CEHubClient
from collections import defaultdict

cehubclient = CEHubClient()

def get_api_data(latitute: float, longitude: float, crop: str):
    relevant_forecast_variables = [
        # Growth & Stress Monitoring
        "TempAir_DailyAvg (C)",
        "TempAir_DailyMax (C)",
        "TempAir_DailyMin (C)",
        "Soiltemperature_0to10cm_DailyAvg (C)",
        "Soiltemperature_0to10cm_DailyMax (C)",
        "Soiltemperature_0to10cm_DailyMin (C)",

        # Irrigation & Water Management
        "Soilmoisture_0to10cm_DailyAvg (vol%)",
        "Soilmoisture_0to10cm_DailyMax (vol%)",
        "Soilmoisture_0to10cm_DailyMin (vol%)",
        "Precip_DailySum (mm)",
        "PrecipProbability_Daily (pct)",
        "ShowerProbability_DailyMax (pct)",
        "Referenceevapotranspiration_DailySum (mm)",
        "Evapotranspiration_DailySum (mm)",

        # Disease & Pest Risk Management
        "HumidityRel_DailyAvg (pct)",
        "HumidityRel_DailyMax (pct)",
        "HumidityRel_DailyMin (pct)",

        # Spraying & Application Conditions
        "WindSpeed_DailyAvg (m/s)",
        "WindSpeed_DailyMax (m/s)",
        "WindSpeed_DailyMin (m/s)",
        "WindGust_DailyMax (m/s)",
        "WindDirection_DailyAvg (Deg)",

        # Photosynthesis & Growth Potential
        "GlobalRadiation_DailySum (Wh/m²)",
        "SunshineDuration_DailySum (min)",

        # Severe Weather & Crop Protection
        "ThunderstormProbability_DailyMax (pct)",
        "SnowFraction_Daily (pct)"
    ]

    forecast_data = cehubclient.get_forecast_daily(
        latitude=latitute,
        longitude=longitude,
        start_date=date.today().strftime("%Y-%m-%d"),
        end_date=(date.today() + timedelta(days=7)).strftime("%Y-%m-%d"),
        measure_labels = relevant_forecast_variables
    )

    # Initialize a dictionary to store the sum and count of each measure
    measure_totals = defaultdict(lambda: {'sum': 0, 'count': 0})

    # Process the data
    for entry in forecast_data:
        measure = entry['measureLabel']
        value = float(entry['dailyValue'])
        measure_totals[measure]['sum'] += value
        measure_totals[measure]['count'] += 1

    # Compute the averages
    averages = {measure: totals['sum'] / totals['count'] for measure, totals in measure_totals.items()}

    return averages
