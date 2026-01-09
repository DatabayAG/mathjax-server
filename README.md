# mathjax-server

A node.js base HTTP wrapper for MathJax 3 to create SVG images for LaTeX expressions.
This server can be configured as Third Party tool in ILIAS 9 an 10.

## Installation as a Docker Container

Log in as a user that is able to build and run docker images.  Clone this repository. Go to the cloned repository and build the container:

````
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


