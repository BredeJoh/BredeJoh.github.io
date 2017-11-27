function Camera(fov, aspectRatio, nearPlane, farPlane) {
    // variables for calculating projection Matrix
    this.fov = fov;
    this.aspectRatio = aspectRatio;
    this.nearPlane = nearPlane;
    this.farPLane = farPlane;

    // variables for camera movement
    this.distance = 15;
    this.angle = Math.PI / -3;
    this.angleStepSize = 0.0075;

    // variables for LookAt for view Matrix
    this.up = vec3(0, 1, 0);
    this.lookPosition = vec3(0, 0, 0);
    this.transform = new Transform([0, 10, 0], [0, 0, 0], [0, 0, 0]);

    // get an initial poition when created
    this.updatePosition();
}

Camera.prototype.getViewMatrix = function()
{
    // look at returns an mat4 based on camera position, look position and up vector
    var viewMatrix = mat4();
    viewMatrix = lookAt([this.transform.position[0], this.transform.position[1], this.transform.position[2]],
                             [this.lookPosition[0], this.lookPosition[1], this.lookPosition[2]],
                             [this.up[0], this.up[1], this.up[2]]);

    return viewMatrix;
}

Camera.prototype.getProjectionMatrix = function()
{
    // gets projection matrix from MV.js
    var projectionMatrix = mat4();
    projectionMatrix = perspective(this.fov, this.aspectRatio, this.nearPlane, this.farPLane);
    return projectionMatrix;
}

Camera.prototype.adjustDistance = function(amount)
{
    // for zooming out, between 5 and 35 in distance from look position
    this.distance -= amount;
    this.distance = Math.max(5, this.distance);
    this.distance = Math.min(35, this.distance);
}

Camera.prototype.rotateAroundLookposition = function(deltaX, deltaY)
{
    // delta x for rotating around center(lookposition)
    this.angle += deltaX * this.angleStepSize;
    //delta y for moving camera up and down between 5 and 20
    this.transform.position[1] += deltaY * this.angleStepSize * 10;
    this.transform.position[1] = Math.min(20, this.transform.position[1]);
    this.transform.position[1] = Math.max(5, this.transform.position[1]);
}

Camera.prototype.updatePosition = function()
{
    // calculates position with a "distance" of from center(0, 0, 0) and angle around center
    this.transform.setPosition([this.distance * Math.cos(this.angle), this.transform.position[1], this.distance * Math.sin(this.angle)]);
}