# mathjax-server

A node.js base HTTP wrapper for MathJax 3 to create SVG images for LaTeX expressions.
This server can be configured as Third Party tool in ILIAS 9 an 10.

## Direct Installation on a Server

This has been tested with node v22.21.0

Create a user account that should be used for running the server:
````
useradd -rm -d /opt/mathjax mathjax
````

Switch to that user and clone this repository. Move to the cloned directory and install the dependencies:
````
su mathjax
cd /opt/mathjax
git clone https://github.com/DatabayAG/mathjax-server.git
cd mathjax-server
npm clean-install --no-scripts
````

Run the service:
````
node service.js
````

It should show you this message:
````
Server running on port 8003
````

You should put this service behind a reverse proxy to call it with https from outside.

### Run as a systemd service

Create a service description file `/etc/systemd/system/mathjax.service`

````
[Unit]
Description=Node.js Mathjax Server

[Service]
Environment=NODE_PORT=8003
User=mathjax
ExecStart=/usr/bin/node /opt/mathjax/mathjax-server/service.js
# Required on some systems
#WorkingDirectory=/opt/mathjax/mathjax-server
Restart=always
# Restart service after 10 seconds if node service crashes
RestartSec=10
SyslogIdentifier=nodejs-mathjax

[Install]
WantedBy=multi-user.target
````

Enable and start the service:

````
systemctl enable mathjax.service
systemctl start mathjax.service 
````

## Installation as a Docker Container

Log in as a user that is able to build and run docker images.  Clone this repository. Go to the cloned repository and build the container:

````
git clone https://github.com/DatabayAG/mathjax-server.git
cd mathjax-server
docker build -t mathjax-server .
````

Run the container:

````
docker run -p 8003:8003 mathjax-server
````

The service should then be available on port 8003 of your docker host. You should put it behind a reverse proxy to call it with https from outside.

## ILIAS Configuration (up to ILIAS 10)

* Open Administration > Third Party Software > Mathjax
* Activate "Enable MathJax on the Server"
* Enter the "Server Address" of the mathjax server
* Choose for which purposes you want to use the server
* Save the settings and check if the "Test expression" is rendered
