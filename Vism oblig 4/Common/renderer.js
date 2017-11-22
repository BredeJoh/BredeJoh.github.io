var renderObject = function (transform)
{
    var modelView = transform.getMatrix();

    gl.uniformMatrix4fv(gl.getUniformLocation(program,
    "modelViewMatrix"), false, flatten(modelView));

    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}