import http.server
import socketserver
import webbrowser
import os

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

import urllib.request

FILE_ID = '1K3WxLCb-yVxLNJvxeYrNEjbZ3L1RPY5Y'
DRIVE_URL = f'https://drive.google.com/uc?export=view&id={FILE_ID}'

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        project_images = {
            '/project-image/securevote': 'images/securevote.png',
            '/project-image/cipherkeep': 'images/cipherkeep.png',
            '/project-image/tictactoe': 'images/tictactoe.png'
        }

        if self.path == '/profile-image' or self.path == '/api/profile-image':
            try:
                # Fetch from Google Drive
                with urllib.request.urlopen(DRIVE_URL) as response:
                    content_type = response.info().get_content_type()
                    data = response.read()
                    
                    self.send_response(200)
                    self.send_header('Content-type', content_type)
                    self.end_headers()
                    self.wfile.write(data)
            except Exception as e:
                print(f"Error fetching image: {e}")
                self.send_error(500, "Could not fetch image")
        elif self.path in project_images:
            try:
                image_path = os.path.join(DIRECTORY, project_images[self.path])
                with open(image_path, 'rb') as f:
                    self.send_response(200)
                    self.send_header('Content-type', 'image/png')
                    self.end_headers()
                    self.wfile.write(f.read())
            except Exception as e:
                print(f"Error serving project image: {e}")
                self.send_error(404, "Image not found")
        else:
            super().do_GET()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def run_server():
    # Allow address reuse
    socketserver.TCPServer.allow_reuse_address = True
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving Portfolio at http://localhost:{PORT}")
        print("Press Ctrl+C to stop the server.")
        
        # Open browser automatically
        webbrowser.open(f"http://localhost:{PORT}")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopping server...")
            httpd.shutdown()

if __name__ == "__main__":
    run_server()
