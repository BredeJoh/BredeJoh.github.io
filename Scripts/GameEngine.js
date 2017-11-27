// alt er laget fra grunnen av basert på angel kap 06: rotatingCube
//
var canvas;
var gl;

var camera;

// array for all normal objects
var gameObjects =
[
    new GameObject(vec3(0.0, 3.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0)),
    new GameObject(vec3(0.0, 2.25, 0.0), vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0)),
    new GameObject(vec3(0.0, 1.5, 0.0), vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0)),
    new GameObject(vec3(0.0, 0.75, 0.0), vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0)),
    new GameObject(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0))
];
// array for particles
var particles = [];

// lighting variables
var lightPosition = vec4(1.0, 4.0, 0.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialShininess = 100.0;

var ctm;
var ambientColor, diffuseColor, specularColor;
var projection;
var viewerPos;
var program;
// fragments from rotating cube
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var theta =[0, 0, 0];

// mouse input variables
var lastMouseX = 0;
var lastMouseY = 0;
var mouseDown = false;

// inits all objects
function initGeometry()
{
    // top part of tree (just a sphere with 0 recursions)
    var tempMeshSphere = new Mesh();
    tempMeshSphere.sphereTetrahedron(va, vb, vc, vd, 0);

    for (var i = 0; i < 5; i++)
    {
        //rotate and scale objects for a proper shape
        gameObjects[i].getTransform().rotate(vec3(90, 0, 0));
        gameObjects[i].getTransform().scalar(vec3(0.3 * i, 0.3 * i, 0.0));
        gameObjects[i].setMesh(tempMeshSphere);
        gameObjects[i].setColor(vec4(0, 1, 1, 1)); //green color
    }

    //trunk
    var tempMeshCube = new Mesh();
    tempMeshCube.cubeMesh();

    gameObjects.push(new GameObject(vec3(0.0, 0.0, 0.0), vec3(90.0, 0.0, 0.0), vec3(0.75, 0.75, 3.0)));
    gameObjects[gameObjects.length - 1].setMesh(tempMeshCube);

    //platform under trunk
    gameObjects.push(new GameObject(vec3(0.0, -2.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(10.0, 0.5, 10.0)));
    gameObjects[gameObjects.length - 1].setMesh(tempMeshCube);

    // decoration spheres
    var tempMeshSphere2 = new Mesh();
    tempMeshSphere2.sphereTetrahedron(va, vb, vc, vd, 3);

    gameObjects.push(new GameObject(vec3(0.85, 2.6, -0.4), vec3(0.0, 0.0, 0.0), vec3(0.2, 0.2, 0.2)));
    gameObjects[gameObjects.length - 1].setMesh(tempMeshSphere2);
    gameObjects[gameObjects.length - 1].setColor(vec4(1, 0, 0, 1));

    gameObjects.push(new GameObject(vec3(1.3, 1.0, -0.7), vec3(0.0, 0.0, 0.0), vec3(0.2, 0.2, 0.2)));
    gameObjects[gameObjects.length - 1].setMesh(tempMeshSphere2);
    gameObjects[gameObjects.length - 1].setColor(vec4(0.0, 0.5, 2, 1));

    gameObjects.push(new GameObject(vec3(-0.85, 2.6, -0.4), vec3(0.0, 0.0, 0.0), vec3(0.2, 0.2, 0.2)));
    gameObjects[gameObjects.length - 1].setMesh(tempMeshSphere2);
    gameObjects[gameObjects.length - 1].setColor(vec4(1, 1, 0, 1));

    gameObjects.push(new GameObject(vec3(-1.3, 1.0, -0.7), vec3(0.0, 0.0, 0.0), vec3(0.2, 0.2, 0.2)));
    gameObjects[gameObjects.length - 1].setMesh(tempMeshSphere2);
    gameObjects[gameObjects.length - 1].setColor(vec4(0.5, 1.0, 0.5, 1));

    gameObjects.push(new GameObject(vec3(0.0, 1.8, 1.2), vec3(0.0, 0.0, 0.0), vec3(0.2, 0.2, 0.2)));
    gameObjects[gameObjects.length - 1].setMesh(tempMeshSphere2);
    gameObjects[gameObjects.length - 1].setColor(vec4(0.5, 2.0, 0.5, 1));

    gameObjects.push(new GameObject(vec3(0.0, 0.25, 1.75), vec3(0.0, 0.0, 0.0), vec3(0.2, 0.2, 0.2)));
    gameObjects[gameObjects.length - 1].setMesh(tempMeshSphere2);
    gameObjects[gameObjects.length - 1].setColor(vec4(0.75, 0.25, 0.75, 1));

    // particles
    for (var i = 0; i < 150; i++)
    {
        // random positions from -10 to 10, and up to 10 in height
        var x = Math.floor(Math.random() * 20 - 10);
        var y = Math.floor(Math.random() * 10);
        var z = Math.floor(Math.random() * 20 - 10);

        //these are just using cube mesh scaled way down
        particles.push(new GameObject(vec3(x, y, z), vec3(0, 0, 0), vec3(0.05, 0.05, 0.05)));
        particles[i].setMesh(tempMeshCube);
    }
}


window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.55, 0.55, 0.55, 1.0); // light gray color

    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // initializes all geometry
    initGeometry();

    //inits buffers for all objects
    for (var i = 0; i < gameObjects.length; i++)
        gameObjects[i].initBuffers();

    // create camera and get projection and viewMatrix
    camera = new Camera(60, gl.canvas.width / gl.canvas.height, 0.1, 1000);
    projection = camera.getProjectionMatrix();
    viewMatrix = camera.getViewMatrix();

    // lighting variables
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    //functions for pressing buttons
    initButtonFunctions();

    // send lighting variables to shader
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), 
       flatten(specularProduct) );	
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), 
       flatten(lightPosition) );
       
    gl.uniform1f(gl.getUniformLocation(program, 
       "shininess"),materialShininess);
    
    //send matrices to shader
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
        false, flatten(projection));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "viewMatrix"), false, flatten(viewMatrix));

    // functions for mouse actions
    var deltaXgravity = 1;
    var deltaYgravity = 0;
    var zoomGravity = 0;

    canvas.onmousedown = function (event)
    {
        mouseDown = true;
        lastMouseX = event.x;
        lastMouseY = event.y;
    }
    canvas.onmousemove = function (event)
    {
        if (!mouseDown)
            return;
        var deltaX = event.x - lastMouseX;
        var deltaY = event.y - lastMouseY;
        deltaXgravity = deltaX;
        deltaYgravity = deltaY;

        lastMouseX = event.x;
        lastMouseY = event.y
    }

    canvas.onmouseup = function (event)
    {
        mouseDown = false;
    }

    canvas.onmousewheel = function (event)
    {
        zoomGravity = event.wheelDelta / 250;
    }

    // ----- MAIN LOOP -------

    var render = function () {
        //smooth damping for camera movement
        deltaXgravity *= 0.90;
        deltaYgravity *= 0.90;
        zoomGravity *= 0.85;

        // change camera position based on input and update its position
        camera.rotateAroundLookposition(deltaXgravity, deltaYgravity);
        camera.adjustDistance(zoomGravity);
        camera.updatePosition();

        // update projection and view matrix
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "viewMatrix"), false, flatten(camera.getViewMatrix()));
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(camera.getProjectionMatrix()));

        // clear canvas
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // render all objects
        for (var i = 0; i < gameObjects.length; i++)
            renderObject(gameObjects[i]);

        //render all particles and move them up if below 0 in the y-axis
        for (var i = 0; i < particles.length; i++)
        {
            var pos = particles[i].transform.position;
            particles[i].transform.translate(vec3(0, -0.05, 0));
        
            if (pos[1] < 0)
                particles[i].transform.position[1] = Math.random() * 2 + 10;
        
            renderObject(particles[i]);
        }

        requestAnimFrame(render);
    }
    //start main loop
    requestAnimationFrame(render);
}

//function for rendering a object
var renderObject = function (gameObject) {
    // update buffers
    gameObject.initBuffers();

    // sends objects color and modelMatrix to shader
    gl.uniform4fv(gl.getUniformLocation(program, "colorIN"), gameObject.getColor());

    gl.uniformMatrix4fv(gl.getUniformLocation(program,
        "modelMatrix"), false, flatten(gameObject.getTransform().getMatrix()));

    //draws object
    gl.drawArrays(gl.TRIANGLES, 0, gameObject.getMesh().getVertices().length);
}


// these functions were used before adding camera movement to test out functionanlity
// i let them be for testing and messing around since they don't break anything

//rotate all objects around z-axis
function rotateZ() {
    axis = zAxis;
    for (var i = 0; i < gameObjects.length; i++)
        gameObjects[i].getTransform().rotate(vec3(0.0, 0.0, 2.0));
}


function initButtonFunctions()
{
    //translate all objects
    document.getElementById("Right").onclick = function ()
    {
        for (var i = 0; i < gameObjects.length; i++)
            gameObjects[i].getTransform().translate(vec3(0.5, 0, 0));
    };

    document.getElementById("Left").onclick = function () {
        for (var i = 0; i < gameObjects.length; i++)
            gameObjects[i].getTransform().translate(vec3(-0.5, 0, 0));
    };

    document.getElementById("Up").onclick = function () {
        for (var i = 0; i < gameObjects.length; i++)
            gameObjects[i].getTransform().translate(vec3(0, 0.5, 0));
    };
    
    document.getElementById("Down").onclick = function () {
        for (var i = 0; i < gameObjects.length; i++)
            gameObjects[i].getTransform().translate(vec3(0, -0.5, 0));
    };
    
    document.getElementById("Forward").onclick = function () {
        for (var i = 0; i < gameObjects.length; i++)
            gameObjects[i].getTransform().translate(vec3(0, 0, 0.5));
    };

    document.getElementById("Back").onclick = function () {
        for (var i = 0; i < gameObjects.length; i++)
            gameObjects[i].getTransform().translate(vec3(0, 0, -0.5));
    };

    //Scale all objects
    document.getElementById("ScaleUp").onclick = function () {
        for (var i = 0; i < gameObjects.length; i++)
            gameObjects[i].getTransform().scalar(vec3(0.1, 0.1, 0.1));
    };

    document.getElementById("ScaleDown").onclick = function () {
        for (var i = 0; i < gameObjects.length; i++)
            gameObjects[i].getTransform().scalar(vec3(-0.1, -0.1, -0.1));
    };

    //rotation all objects
    document.getElementById("ButtonX").onclick = function () {
        axis = xAxis;
        for (var i = 0; i < gameObjects.length; i++)
            gameObjects[i].getTransform().rotate(vec3(5.0, 0.0, 0.0));
    };
    document.getElementById("ButtonY").onclick = function () {
        axis = yAxis;
        for (var i = 0; i < gameObjects.length; i++)
            gameObjects[i].getTransform().rotate(vec3(0.0, 5.0, 0.0));
    };
    document.getElementById("ButtonZ").onclick = function () {
        axis = zAxis;
        for (var i = 0; i < gameObjects.length; i++)
            gameObjects[i].getTransform().rotate(vec3(0.0, 0.0, 5.0));
    };
}
