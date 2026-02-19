import requests
from fastapi import status
from dotenv import load_dotenv
import os

load_dotenv()

BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")

def health_check_function():
    base_url = BASE_URL
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == status.HTTP_200_OK:
            return "Connection is good"
        return "Connection failed"
    except requests.exceptions.RequestException:
        return "Connection failed"


if __name__ == "__main__":
    print(health_check_function())
