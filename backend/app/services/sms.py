import logging
import os
import random
import string

logger = logging.getLogger(__name__)

ESKIZ_EMAIL = os.getenv("ESKIZ_EMAIL", "")
ESKIZ_PASSWORD = os.getenv("ESKIZ_PASSWORD", "")
ESKIZ_FROM = os.getenv("ESKIZ_FROM", "4546")


def generate_password(length: int = 10) -> str:
    chars = string.ascii_letters + string.digits
    pwd = [
        random.choice(string.ascii_uppercase),
        random.choice(string.ascii_lowercase),
        random.choice(string.digits),
        random.choice("!@#$%"),
    ]
    pwd += random.choices(chars, k=length - 4)
    random.shuffle(pwd)
    return "".join(pwd)


def _normalize_phone(phone: str) -> str:
    clean = phone.replace("+", "").replace(" ", "").replace("-", "")
    if not clean.startswith("998"):
        clean = "998" + clean.lstrip("0")
    return clean


def send_credentials_sms(phone: str, email: str, password: str) -> bool:
    message = (
        f"ATMU Smart UniLibrary\n"
        f"Akkauntingiz yaratildi!\n"
        f"Login: {email}\n"
        f"Parol: {password}\n"
        f"atmu.uz"
    )

    if not ESKIZ_EMAIL or not ESKIZ_PASSWORD:
        logger.warning("ESKIZ_EMAIL/PASSWORD not set — SMS skipped. Credentials: %s / %s", email, password)
        return False

    try:
        import requests  # type: ignore[import-untyped]

        auth = requests.post(
            "https://notify.eskiz.uz/api/auth/login",
            data={"email": ESKIZ_EMAIL, "password": ESKIZ_PASSWORD},
            timeout=10,
        )
        if auth.status_code != 200:
            logger.error("Eskiz auth failed: %s", auth.status_code)
            return False

        token = (auth.json().get("data") or {}).get("token", "")
        if not token:
            return False

        resp = requests.post(
            "https://notify.eskiz.uz/api/message/sms/send",
            headers={"Authorization": f"Bearer {token}"},
            data={"mobile_phone": _normalize_phone(phone), "message": message, "from": ESKIZ_FROM},
            timeout=10,
        )
        return resp.status_code == 200
    except Exception:
        logger.exception("SMS send failed")
        return False
