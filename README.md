## Description

The purpose of this API is to provide a routing solution for a given set of coordinates. It aims to calculate approximate routes that connect the coordinates while minimizing the total distance traveled. The API is designed to be used in applications that require route planning, such as delivery services, logistics planning, or navigation systems.

While the routes generated by this API may not be optimal in terms of distance, they provide a reasonable solution that strikes a balance between route efficiency and computational complexity. This makes the API suitable for scenarios where finding the exact optimal route is computationally infeasible or unnecessary.

Overall, the purpose of this API is to simplify the process of route planning and enable applications to efficiently navigate through a given set of coordinates, making it an essential tool for various routing-related applications.

## Getting Started

### Prerequisites

* **git** should be installed (recommended v2.4.11 or higher)
* **docker** and **docker compose** should be installed

### Instalation

```bash
$ git clone https://github.com/Leticia-NdO/routing-api-with-nodejs.git
```

## Running the app

Make sure to open a terminal on the project's directory and then run:

```bash
$ docker-compose up --build
```
And that's it! The API must be running on port 5050.

### Usage

#### POST /api/v1/route

Example request body:

```json
{
	"coordinates": [
		{
			"id": 1,
			"lat": -23.606997872564072,
			"lon": -46.76229420947422
		},
		{
			"id": 2,
			"lat": -23.655728956536628, 
			"lon": -46.69302839465839
		},
		{
			"id": 3,
			"lat": -23.672328669654295, 
			"lon": -46.675916886341575
		}
	],
	"startingPointId": 3
}
```

1. **coordinates** is an array that represents the list of coordinates to be used for route planning. Each coordinate object within the array contains the following properties:
  * id: An identifier for the coordinate. It uniquely identifies each coordinate in the list. Must be a number;
  * lat: The latitude value of the coordinate's geographical location. It specifies the north-south position on the Earth's surface;
  * lon: The longitude value of the coordinate's geographical location. It specifies the east-west position on the Earth's surface.

2. **startingPointId** is the property that specifies the identifier of the starting point for the route. It indicates which coordinate in the "coordinates" array should be considered as the starting point for the route calculation. The API will generate a route that starts from this point and connects the remaining coordinates in an optimized manner.

&nbsp;

Example response:

```json
{
	"data": [
		{
			"coordinates": {
				"id": 3,
				"lat": -23.672328669654295,
				"lon": -46.675916886341575
			},
			"sequence": 1
		},
		{
			"coordinates": {
				"id": 2,
				"lat": -23.655728956536628,
				"lon": -46.69302839465839
			},
			"sequence": 2
		},
		{
			"coordinates": {
				"id": 1,
				"lat": -23.606997872564072,
				"lon": -46.76229420947422
			},
			"sequence": 3
		}
	]
}
```

The response body contains a **data** property, which is an array of objects representing the calculated route. Each object in the array consists of the following properties:

1. **coordinates** is a property that represents a coordinate along the calculated route. It's identical to the coordinate object from the request.

2. **sequence** ia a property that indicates the sequence or order of the coordinate within the route. It specifies the position of the coordinate in the overall route. The coordinates are ordered based on the optimized route calculated by the API.

## Technical notes

This API consists of several classes and algorithms that work together to create approximate routes for a given set of coordinates. Here's a brief description of the API and the algorithms used:

* **Graph**: The Graph class represents a graph data structure that is used to model the connections between the coordinates. It contains methods for adding edges, retrieving edges and nodes, and performing operations on the graph;

* **ChristofidesVertex**: The ChristofidesVertex class represents a vertex in the graph. It contains information such as its neighbors, discovery and finish times, and color. It also has methods for adding neighbors and retrieving vertex properties;

* **CoordinatesWithDistance**: The CoordinatesWithDistance class represents a pair of coordinates along with the distance between them. It is used to store the edges of the graph, with each edge representing a connection between two coordinates;

* **NodeParents**: The NodeParents interface defines the structure of a node in the graph, including its parent and rank. It is used in the Kruskal's algorithm for finding the parent of a node and performing union operations;

* **SpanningTreeMaker**: The SpanningTreeMaker interface defines the contract for a spanning tree maker, which is responsible for generating a minimum spanning tree from a given set of coordinates. It includes the getTree method, which returns the minimum spanning tree as an array of CoordinatesWithDistance;

* **KrustalSpanningTree**: The KrustalSpanningTree class implements the SpanningTreeMaker interface and uses Kruskal's algorithm to generate a minimum spanning tree. It iterates over the edges of the graph, adding edges that do not create cycles until it forms a spanning tree;

* **ApproximationAlgorithm**: The ApproximationAlgorithm interface defines the contract for an approximation algorithm used to calculate an approximate route based on a minimum spanning tree. It includes the getRoute method, which takes the minimum spanning tree and a starting point ID, and returns an approximate route as an array of CoordinatesWithDistance;

* **TwoThirdsApproximationRouteMaker**: The TwoThirdsApproximationRouteMaker class implements the ApproximateRouteCreator interface and uses a two-thirds approximation algorithm to calculate an approximate route. It takes an instance of the SpanningTreeMaker and ApproximationAlgorithm as dependencies and uses them to generate a minimum spanning tree and calculate the approximate route.

The API utilizes the Kruskal's algorithm for generating a minimum spanning tree, which ensures that all coordinates are connected with the minimum total distance. Then, it applies an approximation algorithm (in this case, a two-thirds approximation) to calculate an approximate route based on the minimum spanning tree. The resulting approximate route provides a reasonable solution for routing the given coordinates.

## Stay in touch

- Author - [Leticia Neves de Oliveira](https://www.linkedin.com/in/leticia-neves-dev/)
