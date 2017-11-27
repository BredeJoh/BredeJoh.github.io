

var canvas;
var gl;

//var numVertices  = 36;

//var pointsArray = [];
//var normalsArray = [];

var camera;

var gameObjects =
[
    new GameObject(vec3(0.0, 3.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0)),
    new GameObject(vec3(0.0, 2.25, 0.0), vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0)),
    new GameObject(vec3(0.0, 1.5, 0.0), vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0)),
    new GameObject(vec3(0.0, 0.75, 0.0), vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0)),
    new GameObject(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0))
];

var lightPosition = vec4(1.0, 1.0, 1.0, 0.0 );
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

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var theta =[0, 0, 0];

var thetaLoc;

var lastMouseX = 0;
var lastMouseY = 0;
var mouseDown = false;

var flag = true;

function initGeometry()
{
    // top part of tree (just a sphere with 0 recursions)
    var tempMeshSphere = new Mesh();
    tempMeshSphere.sphereTetrahedron(va, vb, vc, vd, 0);

    for (var i = 0; i < 5; i++)
    {
        gameObjects[i].getTransform().rotate(vec3(90, 0, 0));

        gameObjects[i].getTransform().scalar(vec3(0.3 * i, 0.3 * i, 0.0));
        gameObjects[i].setMesh(tempMeshSphere);
    }

    //for (var i = 5; i < 10; i++) {
    //    gameObjects[i].getTransform().rotate(vec3(0, 180, 0));
    //
    //    gameObjects[i].getTransform().scalar(vec3(0.3 * (i-5), 0.3 * (i-5), 0.0));
    //    gameObjects[i].setMesh(tempMeshSphere);
    //}

    // small spheres around tree, decorations
    //var tempMeshSphere = new Mesh();
    //tempMeshSphere.sphereTetrahedron(va, vb, vc, vd, 3);
    //
    //gameObjects.push(new GameObject(vec3(-0.9, 2.5, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.175, 0.175, 0.175)));
    //gameObjects.push(new GameObject(vec3(0.9, 2.5, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.175, 0.175, 0.175)));
    //gameObjects.push(new GameObject(vec3(-1.1, 1.75, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.175, 0.175, 0.175)));
    //gameObjects.push(new GameObject(vec3(1.1, 1.75, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.175, 0.175, 0.175)));
    //gameObjects.push(new GameObject(vec3(-1.3, 1.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.175, 0.175, 0.175)));
    //gameObjects.push(new GameObject(vec3(1.3, 1.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.175, 0.175, 0.175)));
    //gameObjects.push(new GameObject(vec3(-1.5, 0.25, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.175, 0.175, 0.175)));
    //gameObjects.push(new GameObject(vec3(1.5, 0.25, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.175, 0.175, 0.175)));
    //
    //for (var i = 5; i < gameObjects.length; i++)
    //{
    //    gameObjects[i].setMesh(tempMeshSphere);
    //}

    //trunk
    var tempMeshCube = new Mesh();
    tempMeshCube.cubeMesh();

    gameObjects.push(new GameObject(vec3(0.0, 0.0, 0.0), vec3(90.0, 0.0, 0.0), vec3(0.75, 0.75, 3.0)));
    gameObjects[gameObjects.length - 1].setMesh(tempMeshCube);
}


window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.55, 0.55, 0.55, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // initializes all geometry
    initGeometry();

    //inits buffers for all objects
    for (var i = 0; i < gameObjects.length; i++)
        gameObjects[i].initBuffers();

    thetaLoc = gl.getUniformLocation(program, "theta");

    viewerPos = [0.0, 10.0, 20.0];

    //projection = ortho(-5, 5, -5, 5, -100, 100);
    //projection = perspective(60, gl.canvas.width / gl.canvas.height, 0.1, 1000);

    camera = new Camera([viewerPos[0], viewerPos[1], viewerPos[2]], 60, gl.canvas.width / gl.canvas.height, 0.1, 1000);
    projection = camera.getProjectionMatrix();
    viewMatrix = camera.getViewMatrix();

    //viewMatrix = mat4();
    //viewMatrix = lookAt([viewerPos[0], viewerPos[1], viewerPos[2]], [0, 0, 0], [0, 1, 0] );
    
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    initButtonFunctions();

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
    
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
        false, flatten(projection));

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "viewMatrix"), false, flatten(viewMatrix));

    var colorIN = vec4(0, 1, 1, 1);

    gl.uniform4fv(gl.getUniformLocation(program, "colorIN"), colorIN);



    var deltaXgravity = 1;
    var deltaYgravity = 0;
    var zoomGravity = 0;

    canvas.onmousedown = function (ev)
    {
        mouseDown = true;
        lastMouseX = ev.x;
        lastMouseY = ev.y;
    }
    canvas.onmousemove = function (ev)
    {
        if (!mouseDown)
            return;
        var deltaX = ev.x - lastMouseX;
        var deltaY = ev.y - lastMouseY;
        deltaXgravity = deltaX;
        deltaYgravity = deltaY;

        lastMouseX = ev.x;
        lastMouseY = ev.y
    }

    canvas.onmouseup = function (ev) { mouseDown = false; }

    canvas.onmousewheel = function (ev)
    {
        zoomGravity = ev.wheelDelta / 250;
    }



    var render = function () {

        deltaXgravity *= 0.90;
        deltaYgravity *= 0.90;
        zoomGravity *= 0.85;

        //console.log(deltaXgravity);

        camera.rotateAroundLookposition(deltaXgravity, deltaYgravity);
        camera.adjustDistance(zoomGravity);
        camera.updatePosition();

        gl.uniformMatrix4fv(gl.getUniformLocation(program, "viewMatrix"), false, flatten(camera.getViewMatrix()));
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(camera.getProjectionMatrix()));

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        //rotateZ();

        for (var i = 0; i < gameObjects.length; i++)
            renderObject(gameObjects[i]);

        requestAnimFrame(render);
    }
    requestAnimationFrame(render);
}



function rotateZ() {

    axis = zAxis;
    for (var i = 0; i < gameObjects.length; i++)
        gameObjects[i].getTransform().rotate(vec3(0.0, 0.0, 2.0));
}


function initButtonFunctions()
{
    //translate
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

    //Scale
    document.getElementById("ScaleUp").onclick = function () {
        for (var i = 0; i < gameObjects.length; i++)
            gameObjects[i].getTransform().scalar(vec3(0.1, 0.1, 0.1));
    };

    document.getElementById("ScaleDown").onclick = function () {
        for (var i = 0; i < gameObjects.length; i++)
            gameObjects[i].getTransform().scalar(vec3(-0.1, -0.1, -0.1));
    };

    //rotation
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
