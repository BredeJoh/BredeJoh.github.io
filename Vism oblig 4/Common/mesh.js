
function Mesh() {
    this.vertices = [];
    this.normals = [];
}

Mesh.prototype.getVertices = function () {
    return this.vertices;
}

//Mesh.prototype.setVertices = function (_vertices) {
//    for (var i = 0; i < _vertices.length; i++)
//        this.vertices.push(_vertices[i]);
//}

Mesh.prototype.getNormals = function () {
    return this.normals;
}

//Mesh.prototype.setNormals = function (_normals) {
//    for (var i = 0; i < _normals.length; i++)
//        this.normals.push(_normals[i]);
//}


Mesh.prototype.cubeMesh = function()
{
    this.vertices = [];
    this.normals = [];

    this.cubeQuad(1, 0, 3, 2);
    this.cubeQuad(2, 3, 7, 6);
    this.cubeQuad(3, 0, 4, 7);
    this.cubeQuad(6, 5, 1, 2);
    this.cubeQuad(4, 5, 6, 7);
    this.cubeQuad(5, 4, 0, 1);
}

Mesh.prototype.cubeQuad = function(a, b, c, d)
{
    var t1 = subtract(tempCubeVertices[b], tempCubeVertices[a]);
    var t2 = subtract(tempCubeVertices[c], tempCubeVertices[b]);
    var tempNormal = cross(t1, t2);
    var tempNormal = vec3(tempNormal);

 
    this.vertices.push(tempCubeVertices[a]);
    this.normals.push(tempNormal);
    this.vertices.push(tempCubeVertices[b]);
    this.normals.push(tempNormal);
    this.vertices.push(tempCubeVertices[c]);
    this.normals.push(tempNormal);
    this.vertices.push(tempCubeVertices[a]);
    this.normals.push(tempNormal);
    this.vertices.push(tempCubeVertices[c]);
    this.normals.push(tempNormal);
    this.vertices.push(tempCubeVertices[d]);
    this.normals.push(tempNormal);
}

var tempCubeVertices = [
        vec4(-0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, 0.5, 0.5, 1.0),
        vec4(0.5, 0.5, 0.5, 1.0),
        vec4(0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5, 0.5, -0.5, 1.0),
        vec4(0.5, 0.5, -0.5, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0)
];