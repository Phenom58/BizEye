import re
import time
from collections import defaultdict
from typing import Tuple, Dict, List
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse

# Regular expressions for SQL Injection, Cross-Site Scripting (XSS), Path Traversal, and Command Injection
SQLI_PATTERNS = [
    r"(?i)\b(union\s+all\s+select|union\s+select)\b",
    r"(?i)\b(select\s+.*\s+from|insert\s+into|delete\s+from|drop\s+table|drop\s+database|truncate\s+table|alter\s+table)\b",
    r"(?i)('\s*or\s*'1'\s*=\s*'1|'\s*or\s*1\s*=\s*1|'\s*or\s*true\b|--\s*$|/\*.*?\*/|;\s*--)",
    r"(?i)\b(exec\s*\(|execute\s*\(|xp_cmdshell|sp_executesql)\b",
    r"(?i)\b(waitfor\s+delay|sleep\s*\(\s*\d+\s*\)|benchmark\s*\()",
    r"(?i)\b(information_schema|sysdatabases|sysobjects|syscolumns)\b",
]

XSS_PATTERNS = [
    r"(?i)<\s*script[^>]*>",
    r"(?i)javascript\s*:",
    r"(?i)onload\s*=",
    r"(?i)onerror\s*=",
    r"(?i)onclick\s*=",
    r"(?i)eval\s*\(",
]

PATH_TRAVERSAL_PATTERNS = [
    r"(\.\./|\.\.\\)",
    r"(%2e%2e%2f|%2e%2e\/|%2e%2e%5c)",
    r"(etc/passwd|windows/system32|boot\.ini)",
]

COMPILED_SQLI = [re.compile(p) for p in SQLI_PATTERNS]
COMPILED_XSS = [re.compile(p) for p in XSS_PATTERNS]
COMPILED_PATH = [re.compile(p) for p in PATH_TRAVERSAL_PATTERNS]


def scan_for_malicious_content(content: str) -> Tuple[bool, str]:
    """Scans text for SQL Injection, XSS, and Path Traversal payloads."""
    if not content or len(content) > 1000000:
        return False, ""

    for pattern in COMPILED_SQLI:
        if pattern.search(content):
            return True, "SQL injection pattern detected"

    for pattern in COMPILED_XSS:
        if pattern.search(content):
            return True, "Cross-site scripting pattern detected"

    for pattern in COMPILED_PATH:
        if pattern.search(content):
            return True, "Path traversal pattern detected"

    return False, ""


class InMemoryRateLimiter:
    """Sliding-window IP rate limiter to protect endpoints from brute-force and DoS attacks."""
    def __init__(self, requests_per_minute: int = 120):
        self.requests_per_minute = requests_per_minute
        self.ip_history: Dict[str, List[float]] = defaultdict(list)

    def is_rate_limited(self, client_ip: str) -> bool:
        now = time.time()
        window_start = now - 60.0

        # Filter out timestamps older than 60 seconds
        timestamps = [t for t in self.ip_history[client_ip] if t > window_start]
        self.ip_history[client_ip] = timestamps

        if len(timestamps) >= self.requests_per_minute:
            return True

        self.ip_history[client_ip].append(now)
        return False


# Global rate limiter instance (120 requests/min per IP)
rate_limiter = InMemoryRateLimiter(requests_per_minute=120)
