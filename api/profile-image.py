from http.server import BaseHTTPRequestHandler
import urllib.request

FILE_ID = '1K3WxLCb-yVxLNJvxeYrNEjbZ3L1RPY5Y'
DRIVE_URL = f'https://drive.google.com/uc?export=view&id={FILE_ID}'

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Fetch from Google Drive
            with urllib.request.urlopen(DRIVE_URL) as response:
                content_type = response.info().get_content_type()
                data = response.read()
                
                self.send_response(200)
                self.send_header('Content-type', content_type)
                self.send_header('Cache-Control', 'public, max-age=3600')
                self.end_headers()
                self.wfile.write(data)
        except Exception as e:
            self.send_error(500, f"Could not fetch image: {str(e)}")
