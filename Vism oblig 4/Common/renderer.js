var renderObject = function (gameObject)
{
    gameObject.initBuffers();

    var modelView = gameObject.getTransform().getMatrix();

    gl.uniformMatrix4fv(gl.getUniformLocation(program,
    "modelViewMatrix"), false, flatten(modelView));

    gl.drawArrays(gl.TRIANGLES, 0, gameObject.getMesh().getVertices().length);
}