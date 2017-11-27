var renderObject = function (gameObject)
{
    gameObject.initBuffers();

    var modelMatrix = gameObject.getTransform().getMatrix();

    gl.uniformMatrix4fv(gl.getUniformLocation(program,
        "modelMatrix"), false, flatten(modelMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, gameObject.getMesh().getVertices().length);
}