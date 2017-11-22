
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

var va = vec4(0.0, 0.0, -1.0, 1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333, 1);

var numTimesToSubdivide = 3;

Mesh.prototype.divideSphereTriangle = function(a, b, c, count)
{
    if (count > 0) {

        var ab = mix(a, b, 0.5);
        var ac = mix(a, c, 0.5);
        var bc = mix(b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        this.divideSphereTriangle(a, ab, ac, count - 1);
        this.divideSphereTriangle(ab, b, bc, count - 1);
        this.divideSphereTriangle(bc, c, ac, count - 1);
        this.divideSphereTriangle(ab, bc, ac, count - 1);
    }
    else {
        this.createSphereTriangle(a, b, c);
    }
}

Mesh.prototype.sphereTetrahedron = function (a, b, c, d, n)
{
    this.divideSphereTriangle(a, b, c, n);
    this.divideSphereTriangle(d, c, b, n);
    this.divideSphereTriangle(a, d, b, n);
    this.divideSphereTriangle(a, c, d, n);
}

Mesh.prototype.createSphereTriangle = function (a, b, c)
{
    this.vertices.push(a);
    this.vertices.push(b);
    this.vertices.push(c);

    this.normals.push(a[0], a[1], a[2], 0.0);
    this.normals.push(b[0], b[1], b[2], 0.0);
    this.normals.push(c[0], c[1], c[2], 0.0);
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