function Camera(position, fov, aspectRatio, nearPlane, farPlane) {
    this.fov = fov;
    this.aspectRatio = aspectRatio;
    this.nearPlane = nearPlane;
    this.farPLane = farPlane;

    this.distance = 15;
    this.angle = Math.PI / -3;
    this.angleStepSize = 0.0075;

    this.up = vec3(0, 1, 0);
    this.lookPosition = vec3(0, 0, 0);
    this.transform = new Transform([position[0], position[1], position[2]], [0, 0, 0], [0, 0, 0]);

    this.updatePosition();
}

Camera.prototype.getViewMatrix = function()
{
    var viewMatrix = mat4();
    viewMatrix = lookAt([this.transform.position[0], this.transform.position[1], this.transform.position[2]],
                             [this.lookPosition[0], this.lookPosition[1], this.lookPosition[2]],
                             [this.up[0], this.up[1], this.up[2]]);

    return viewMatrix;
}

Camera.prototype.getProjectionMatrix = function()
{
    var projectionMatrix = mat4();
    projectionMatrix = perspective(this.fov, this.aspectRatio, this.nearPlane, this.farPLane);
    return projectionMatrix;
}

Camera.prototype.adjustDistance = function(amount)
{
    this.distance -= amount;
    this.distance = Math.max(5, this.distance);
    this.distance = Math.min(35, this.distance);
}

Camera.prototype.rotateAroundLookposition = function(deltaX, deltaY)
{
    this.angle += deltaX * this.angleStepSize;
    this.transform.position[1] += deltaY * this.angleStepSize * 10;
    this.transform.position[1] = Math.min(20, this.transform.position[1]);
    this.transform.position[1] = Math.max(5, this.transform.position[1]);
}

Camera.prototype.updatePosition = function()
{
    this.transform.setPosition([this.distance * Math.cos(this.angle), this.transform.position[1], this.distance * Math.sin(this.angle)]);
}