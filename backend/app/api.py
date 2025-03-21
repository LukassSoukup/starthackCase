import datetime
from syngenta.syngenta_api import CEHubClient
from collections import defaultdict
from syngenta.syngenta_algorithms import (
    daytime_heat_stress,
    nighttime_heat_stress,
    frost_stress,
    drought_index,
)

cehubclient = CEHubClient()

def get_forecast_data(latitute: float, longitude: float, crop: str):
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
        start_date=datetime.date.today().strftime("%Y-%m-%d"),
        end_date=(datetime.date.today() + datetime.timedelta(days=7)).strftime("%Y-%m-%d"),
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


def get_forecast_stress(latitute: float, longitude: float, crop: str):
    variables = [
        "TempAir_DailyAvg (C)",
        "TempAir_DailyMax (C)",
        "TempAir_DailyMin (C)",
        "Soilmoisture_0to10cm_DailyAvg (vol%)",
        "Evapotranspiration_DailySum (mm)",
        "Precip_DailySum (mm)",
    ]

    forecast_data = cehubclient.get_forecast_daily(
        latitude=latitute,
        longitude=longitude,
        start_date=datetime.date.today().strftime("%Y-%m-%d"),
        end_date=(datetime.date.today() + datetime.timedelta(days=7)).strftime("%Y-%m-%d"),
        measure_labels = variables
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

    stress_indexes = {}
    stress_indexes["daytime_heat_stress"] = daytime_heat_stress(
        tmax=averages["TempAir_DailyMax (C)"],
        crop=crop,
    )
    stress_indexes["nighttime_heat_stress"] = nighttime_heat_stress(
        tmin=averages["TempAir_DailyMin (C)"],
        crop=crop,
    )
    stress_indexes["frost_stress"] = frost_stress(
        tmin=averages["TempAir_DailyMin (C)"],
        crop=crop,
    )
    stress_indexes["drought_index"] = drought_index(
        precipitation=averages["Precip_DailySum (mm)"],
        evaporation=averages["Evapotranspiration_DailySum (mm)"],
        soil_moisture=averages["Soilmoisture_0to10cm_DailyAvg (vol%)"],
        temperature=averages["TempAir_DailyAvg (C)"],
        crop=crop,
    )
    
    return stress_indexes


def get_historical_data(latitute: float, longitude: float, crop: str):
    historic_data = cehubclient.get_historical_daily(
        latitude=latitute,
        longitude=longitude,
        location_name="",
        elevation=0,
        start_date=(datetime.date.today() - datetime.timedelta(days=7)).strftime("%Y-%m-%d"),
        end_date=datetime.date.today().strftime("%Y-%m-%d"),
        queries=[
            {
                "domain": "ERA5T",
                "gapFillDomain": "NEMSGLOBAL",
                "timeResolution": "daily",
                "codes": [
                    {
                        "code": 11,
                        "level": "2 m above gnd",
                        "aggregation": "max",
                    },  # Max temperature
                    {
                        "code": 11,
                        "level": "2 m above gnd",
                        "aggregation": "min",
                    },  # Min temperature
                    {
                        "code": 11,
                        "level": "2 m above gnd",
                        "aggregation": "mean",
                    },  # Avg temperature
                    {"code": 61, "level": "sfc", "aggregation": "sum"},  # Precipitation
                    {
                        "code": 261,
                        "level": "sfc",
                        "aggregation": "sum",
                    },  # Evapotranspiration
                    {
                        "code": 144,
                        "level": "0-7 cm down",
                        "aggregation": "mean",
                    },  # Soil moisture
                ],
            },
        ],
    )

    historic_data = {
        "dates": historic_data[0]["timeIntervals"][0],
        "tmax": historic_data[0]["codes"][0]["dataPerTimeInterval"][0]["data"][0],
        "tmin": historic_data[0]["codes"][1]["dataPerTimeInterval"][0]["data"][0],
        "tmean": historic_data[0]["codes"][2]["dataPerTimeInterval"][0]["data"][0],
        "precipitation": historic_data[0]["codes"][3]["dataPerTimeInterval"][0]["data"][0],
        "evapotranspiration": historic_data[0]["codes"][4]["dataPerTimeInterval"][0][
            "data"
        ][0],
        "soil_moisture": historic_data[0]["codes"][5]["dataPerTimeInterval"][0]["data"][0],
    }

    dates = []
    metrics = {
        "daytime_heat_stress": [],
        "nighttime_heat_stress": [],
        "frost_stress": [],
        "drought_index": [],
    }

    # daytime_heat_stress
    for date, tmax in zip(
        historic_data["dates"],
        historic_data["tmax"],
    ):
        dates.append(datetime.datetime.strptime(date, "%Y%m%dT%H%M"))

        metrics["daytime_heat_stress"].append(
            daytime_heat_stress(
                tmax=float(tmax),
                crop="soybean",
            )
        )

    # nighttime_heat_stress
    for date, tmin in zip(
        historic_data["dates"],
        historic_data["tmin"],
    ):
        metrics["nighttime_heat_stress"].append(
            nighttime_heat_stress(
                tmin=float(tmin),
                crop="soybean",
            )
        )

    # frost_stress
    for date, tmin in zip(
        historic_data["dates"],
        historic_data["tmin"],
    ):
        metrics["frost_stress"].append(
            frost_stress(
                tmin=float(tmin),
                crop="soybean",
            )
        )

    # drought_index
    for date, precipitation, tmean, evapotranspiration, soil_moisture in zip(
        historic_data["dates"],
        historic_data["precipitation"],
        historic_data["tmean"],
        historic_data["evapotranspiration"],
        historic_data["soil_moisture"],
    ):
        metrics["drought_index"].append(
            drought_index(
                precipitation=precipitation,
                evaporation=evapotranspiration,
                soil_moisture=soil_moisture,
                temperature=tmean,
            )
        )

    # Compute the average of each metric
    average_metrics = {metric: sum(values) / len(values) for metric, values in metrics.items()}

    return average_metrics
