#!/usr/bin/env python3
"""Dev server with no-cache headers — prevents stale browser cache."""
import http.server
import os

PORT = 8765
DIRECTORY = os.path.dirname(os.path.abspath(__file__))


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, format, *args):
        pass  # silence request logs


if __name__ == "__main__":
    with http.server.HTTPServer(("127.0.0.1", PORT), NoCacheHandler) as httpd:
        print(f"Serving {DIRECTORY} on http://localhost:{PORT}")
        httpd.serve_forever()
