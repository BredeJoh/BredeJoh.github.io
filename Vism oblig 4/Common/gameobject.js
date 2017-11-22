

function GameObject(position, rotation, scale)
{
    this.transform = new Transform(position, rotation, scale);
    this.vertices = [];
    this.normals = [];
    this.mesh = new Mesh();
}

GameObject.prototype.getTransform = function()
{
    return this.transform;
}

GameObject.prototype.getMesh = function () {
    return this.mesh;
}

GameObject.prototype.setMesh = function(_mesh)
{
    this.mesh = _mesh;
}


GameObject.prototype.initBuffers = function()
{
    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(this.getMesh().getNormals()), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(this.getMesh().getVertices()), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);


}