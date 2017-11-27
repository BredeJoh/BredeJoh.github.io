var renderObject = function (gameObject)
{
    gameObject.initBuffers();

    gl.uniform4fv(gl.getUniformLocation(program, "colorIN"), gameObject.getColor());

    gl.uniformMatrix4fv(gl.getUniformLocation(program,
        "modelMatrix"), false, flatten(gameObject.getTransform().getMatrix()));

    gl.drawArrays(gl.TRIANGLES, 0, gameObject.getMesh().getVertices().length);
}