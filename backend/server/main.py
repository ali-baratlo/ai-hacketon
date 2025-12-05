import json
from http.server import BaseHTTPRequestHandler, HTTPServer
import urllib.parse

# Load JSON once at startup
with open("output.json", "r", encoding="utf-8") as f:
    DATA = json.load(f)

# Convert list to dict for fast lookup
DATA_BY_ID = {item["restaurant_id"]: item for item in DATA}


class RequestHandler(BaseHTTPRequestHandler):

    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

    def do_GET(self):
        # Example path: /analyze/3
        parts = self.path.strip("/").split("/")

        if len(parts) == 2 and parts[0] == "analyze":
            try:
                restaurant_id = int(parts[1])
            except ValueError:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": "Invalid ID"}).encode("utf-8"))
                return

            result = DATA_BY_ID.get(restaurant_id)
            if result:
                self._set_headers(200)
                self.wfile.write(json.dumps(result, ensure_ascii=False).encode("utf-8"))
            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({"error": "Restaurant not found"}).encode("utf-8"))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Invalid endpoint"}).encode("utf-8"))


def run(server_class=HTTPServer, handler_class=RequestHandler, port=8000):
    print(f"Server running on http://localhost:{port}")
    server = server_class(('', port), handler_class)
    server.serve_forever()


if __name__ == "__main__":
    run()

