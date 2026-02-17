"""Generate the OpenAPI spec JSON from the FastAPI app.

Usage:
    uv run python scripts/generate_openapi.py [output_path]

If output_path is omitted, writes to openapi.json in the project root.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from fastapi import FastAPI

from app.api.routes.physics import router as physics_router


def build_spec() -> dict:
    app = FastAPI(title="AI Tutor Service", version="0.1.0")
    app.include_router(physics_router, prefix="/api/v1")

    spec = app.openapi()
    spec["servers"] = [
        {"url": "http://localhost:8000", "description": "Local"},
    ]
    return spec


def main() -> None:
    output = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("openapi.json")
    spec = build_spec()

    output.write_text(json.dumps(spec, indent=2) + "\n")
    print(f"OpenAPI spec written to {output}")


if __name__ == "__main__":
    main()
