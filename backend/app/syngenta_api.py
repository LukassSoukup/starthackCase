import requests
from typing import List, Dict, Union, Optional
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=".env")


class CEHubClient:
    """
    Client for interacting with the CE Hub APIs for forecasts and historical data.
    """

    def __init__(self):
        """
        Initialize the CE Hub client.
        """
        self.forecast_token = os.getenv("FORECAST_API_KEY")
        self.historical_token = "e4e4d60f7203"
        self.weather_source = "Meteoblue"

        # Base URLs
        self.forecast_base_url = "https://services.cehub.syngenta-ais.com/api/Forecast"
        self.historical_base_url = "http://my.meteoblue.com/dataset/query"

    def get_forecast_daily(
        self,
        latitude: float,
        longitude: float,
        measure_labels: Optional[List[str]],
        start_date: Union[str] = None,
        end_date: Union[str] = None,
    ) -> Dict:
        """
        Get daily forecast data.

        Args:
            latitude: Location latitude
            longitude: Location longitude
            start_date: Start date (YYYY-MM-DD or datetime object)
            end_date: End date (YYYY-MM-DD or datetime object)
            measure_labels: List of weather parameters to retrieve

        Returns:
            Dictionary containing the forecast data
        """
        # Join measure labels
        measure_label_str = ";".join(measure_labels)

        # Prepare request
        url = f"{self.forecast_base_url}/ShortRangeForecastDaily"
        headers = {
            "Accept": "application/json, text/plain, */*",
            "ApiKey": self.forecast_token,
        }
        params = {
            "format": "json",
            "supplier": self.weather_source,
            "startDate": start_date,
            "endDate": end_date,
            "measureLabel": measure_label_str,
            "latitude": latitude,
            "longitude": longitude,
        }

        # Make request
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()

        return response.json()

    def get_forecast_hourly(
        self,
        latitude: float,
        longitude: float,
        measure_labels: Optional[List[str]],
        start_date: Union[str] = None,
        end_date: Union[str] = None,
    ) -> Dict:
        """
        Get hourly forecast data.

        Args:
            latitude: Location latitude
            longitude: Location longitude
            start_date: Start date (YYYY-MM-DD)
            end_date: End date (YYYY-MM-DD)
            measure_labels: List of weather parameters to retrieve

        Returns:
            Dictionary containing the forecast data
        """
        # Join measure labels
        measure_label_str = ";".join(measure_labels)

        # Prepare request
        url = f"{self.forecast_base_url}/ShortRangeForecastHourly"
        headers = {"Accept": "*/*", "ApiKey": self.forecast_token}
        params = {
            "format": "json",
            "supplier": self.weather_source,
            "startDate": start_date,
            "endDate": end_date,
            "measureLabel": measure_label_str,
            "latitude": latitude,
            "longitude": longitude,
        }

        # Make request
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()

        return response.json()

    def get_nowcast(
        self,
        latitude: float,
        longitude: float,
        measure_labels: Optional[List[str]],
        start_date: Union[str] = None,
        end_date: Union[str, None] = None,
    ) -> Dict:
        """
        Get nowcast data (15-minute intervals).

        Args:
            latitude: Location latitude
            longitude: Location longitude
            start_date: Start date (YYYY-MM-DD)
            end_date: End date (YYYY-MM-DD)
            measure_labels: List of weather parameters to retrieve

        Returns:
            Dictionary containing the nowcast data
        """
        # Join measure labels
        measure_label_str = ";".join(measure_labels)

        # Prepare request
        url = f"{self.forecast_base_url}/Nowcast"
        headers = {"Accept": "*/*", "ApiKey": self.forecast_token}
        params = {
            "format": "json",
            "supplier": self.weather_source,
            "startDate": start_date,
            "endDate": end_date,
            "measureLabel": measure_label_str,
            "latitude": latitude,
            "longitude": longitude,
        }

        # Make request
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()

        return response.json()

    def get_historical_daily(
        self,
        longitude: float,
        latitude: float,
        elevation: float,
        location_name: str,
        start_date: str,
        end_date: str,
        queries: list,
    ) -> Dict:
        """
        Get historical daily weather data.

        Args:
            longitude: Location longitude
            latitude: Location latitude
            elevation: Location elevation in meters
            location_name: Name of the location
            start_date: Start date (YYYY-MM-DD)
            end_date: End date (YYYY-MM-DD)

        Returns:
            Dictionary containing the historical data
        """
        # Format dates
        start_date_str = f"{start_date}T+01:00"
        end_date_str = f"{end_date}T+01:00"

        # Prepare request payload
        payload = {
            "units": {
                "temperature": "C",
                "velocity": "km/h",
                "length": "metric",
                "energy": "watts",
            },
            "geometry": {
                "type": "MultiPoint",
                "coordinates": [[longitude, latitude, elevation]],
                "locationNames": [location_name],
                "mode": "preferLandWithMatchingElevation",
            },
            "format": "json",
            "timeIntervals": [f"{start_date_str}/{end_date_str}"],
            "timeIntervalsAlignment": "none",
            "queries": queries,
        }

        # Prepare request
        url = f"{self.historical_base_url}"
        params = {"apikey": self.historical_token}
        headers = {"Content-Type": "application/json"}

        # Make request
        response = requests.post(url, headers=headers, params=params, json=payload)
        response.raise_for_status()

        return response.json()

    def get_historical_hourly(
        self,
        longitude: float,
        latitude: float,
        elevation: float,
        location_name: str,
        start_date: str,
        end_date: str,
        queries: list,
    ) -> Dict:
        """
        Get historical hourly weather data.

        Args:
            longitude: Location longitude
            latitude: Location latitude
            elevation: Location elevation in meters
            location_name: Name of the location
            start_date: Start date (YYYY-MM-DD or datetime object)
            end_date: End date (YYYY-MM-DD or datetime object)

        Returns:
            Dictionary containing the historical data
        """
        # Format dates
        start_date_str = f"{start_date}T+01:00"
        end_date_str = f"{end_date}T+01:00"

        # Prepare request payload
        payload = {
            "units": {
                "temperature": "C",
                "velocity": "km/h",
                "length": "metric",
                "energy": "watts",
            },
            "geometry": {
                "type": "MultiPoint",
                "coordinates": [[longitude, latitude, elevation]],
                "locationNames": [location_name],
                "mode": "preferLandWithMatchingElevation",
            },
            "format": "json",
            "timeIntervals": [f"{start_date_str}/{end_date_str}"],
            "timeIntervalsAlignment": "none",
            "queries": queries,
        }

        # Prepare request
        url = f"{self.historical_base_url}"
        params = {"apikey": self.historical_token}
        headers = {"Content-Type": "application/json"}

        # Make request
        response = requests.post(url, headers=headers, params=params, json=payload)
        response.raise_for_status()

        return response.json()

    def get_soil_data(
        self,
        longitude: float,
        latitude: float,
        elevation: float,
        location_name: str,
        start_date: str,
        end_date: str,
        queries: list,
    ) -> Dict:
        """
        Get soil data for a location.

        Args:
            longitude: Location longitude
            latitude: Location latitude
            elevation: Location elevation in meters
            location_name: Name of the location
            start_date: Start date (YYYY-MM-DD)
            end_date: End date (YYYY-MM-DD)

        Returns:
            Dictionary containing the soil data
        """
        # Format dates
        start_date_str = f"{start_date}T+01:00"
        end_date_str = f"{end_date}T+01:00"

        # Prepare request payload
        payload = {
            "units": {
                "temperature": "C",
                "velocity": "km/h",
                "length": "metric",
                "energy": "watts",
            },
            "geometry": {
                "type": "MultiPoint",
                "coordinates": [[longitude, latitude, elevation]],
                "locationNames": [location_name],
                "mode": "preferLandWithMatchingElevation",
            },
            "format": "json",
            "timeIntervals": [f"{start_date_str}/{end_date_str}"],
            "timeIntervalsAlignment": "none",
            "queries": queries,
        }

        # Prepare request
        url = f"{self.historical_base_url}"
        params = {"apikey": self.historical_token}
        headers = {"Content-Type": "application/json"}

        # Make request
        response = requests.post(url, headers=headers, params=params, json=payload)
        response.raise_for_status()

        return response.json()
