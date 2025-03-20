import json
from datetime import datetime
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from syngenta_api import CEHubClient
from syngenta_algorithms import (
    daytime_heat_stress,
    nighttime_heat_stress,
    frost_stress,
    drought_index,
    yield_risk,
    nitrogen_use_efficiency,
    phosphorus_use_efficiency,
)

cehubclient = CEHubClient()

historic_data = cehubclient.get_historical_daily(
    latitude=20.3856,
    longitude=78.5494,
    location_name="",
    elevation=0,
    start_date="2023-01-01",
    end_date="2024-12-30",
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
    dates.append(datetime.strptime(date, "%Y%m%dT%H%M"))

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

# # yeild_risk
# for date, precipitation, tmean, evapotranspiration, soil_moisture in zip(
#     historic_data["dates"],
#     historic_data["precipitation"],
#     historic_data["tmean"],
#     historic_data["evapotranspiration"],
#     historic_data["soil_moisture"],
# ):
#     metrics["yield_risk"].append(
#         yield_risk(
#             tmin=0,
#             tmax=0,
#             tbase=0,
#             precipitation=precipitation,
#             ph=0,
#             nitrogen=0,
#             crop="soybean",
#         )
#     )


# Create the plot
fig, ax = plt.subplots(figsize=(10, 6))
for metric in metrics.keys():
    ax.plot(
        dates,
        metrics[metric],
        linestyle="-",
        label=metric,
    )

# Get year range from the data
years = list(set(date.year for date in dates))
years.sort()

# Define seasons
season_colors = {
    "Winter": ("12-01", "02-28", "lightblue"),
    "Summer": ("03-01", "05-31", "lightcoral"),
    "Monsoon": ("06-01", "09-30", "lightgreen"),
}

# Highlight same seasons in both years
for year in years:
    for season, (start, end, color) in season_colors.items():
        start_date = datetime.strptime(f"{year}-{start}", "%Y-%m-%d")
        end_date = datetime.strptime(f"{year}-{end}", "%Y-%m-%d")
        ax.axvspan(
            start_date,
            end_date,
            color=color,
            alpha=0.3,
            label=season if year == years[0] else "",
        )

# Formatting the plot
ax.set_xlabel("Date")
ax.legend()
ax.grid(True)

# Formatting the x-axis with readable date format
ax.xaxis.set_major_formatter(mdates.DateFormatter("%Y-%m-%d"))
plt.xticks(rotation=30)  # Rotate dates for better visibility

# Show the plot
plt.show()
