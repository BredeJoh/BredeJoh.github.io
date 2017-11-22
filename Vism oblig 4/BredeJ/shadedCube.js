

var canvas;
var gl;

var numVertices  = 36;

var pointsArray = [];
var normalsArray = [];

var gameObjects =
[
    new GameObject(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0)),
    new GameObject(vec3(2.0, 2.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0)),
    new GameObject(vec3(-2.0, 2.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0)),
    new GameObject(vec3(-2.0, -2.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0)),
    new GameObject(vec3(2.0, -2.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0))
];

var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 )
];

var vertices2 = [
        vec4(-0.75, -0.75, 0.75, 1.0),
        vec4(-0.75, 0.75, 0.75, 1.0),
        vec4(0.75, 0.75, 0.75, 1.0),
        vec4(0.75, -0.75, 0.75, 1.0),
        vec4(-0.75, -0.75, -0.75, 1.0),
        vec4(-0.75, 0.75, -0.75, 1.0),
        vec4(0.75, 0.75, -0.75, 1.0),
        vec4(0.75, -0.75, -0.75, 1.0)
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
var modelView, projection;
var viewerPos;
var program;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var theta =[0, 0, 0];

var thetaLoc;

var flag = true;

function quad(a, b, c, d) {

    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);

    for (var i = 0; i < gameObjects.length - 1; i++)
    {
        var mesh = gameObjects[i].getMesh();

        mesh.getVertices().push(vertices[a]);
        mesh.getNormals().push(normal);
        mesh.getVertices().push(vertices[b]);
        mesh.getNormals().push(normal);
        mesh.getVertices().push(vertices[c]);
        mesh.getNormals().push(normal);
        mesh.getVertices().push(vertices[a]);
        mesh.getNormals().push(normal);
        mesh.getVertices().push(vertices[c]);
        mesh.getNormals().push(normal);
        mesh.getVertices().push(vertices[d]);
        mesh.getNormals().push(normal);

        gameObjects[i].setMesh(mesh);
    }
    

    var r1 = subtract(vertices2[b], vertices2[a]);
    var r2 = subtract(vertices2[c], vertices2[b]);
    var normal2 = cross(r1, r2);
    var normal2 = vec3(normal2);
     
    var mesh2 = gameObjects[gameObjects.length - 1].getMesh();

    mesh2.getVertices().push(vertices2[a]);
    mesh2.getNormals().push(normal2);
    mesh2.getVertices().push(vertices2[b]);
    mesh2.getNormals().push(normal2);
    mesh2.getVertices().push(vertices2[c]);
    mesh2.getNormals().push(normal2);
    mesh2.getVertices().push(vertices2[a]);
    mesh2.getNormals().push(normal2);
    mesh2.getVertices().push(vertices2[c]);
    mesh2.getNormals().push(normal2);
    mesh2.getVertices().push(vertices2[d]);
    mesh2.getNormals().push(normal2);

    gameObjects[gameObjects.length - 1].setMesh(mesh2);
    
}


function initGeometry()
{
    //quad( 1, 0, 3, 2);
    //quad( 2, 3, 7, 6);
    //quad( 3, 0, 4, 7);
    //quad( 6, 5, 1, 2);
    //quad( 4, 5, 6, 7);
    //quad(5, 4, 0, 1);

    
    
    for (var i = 0; i < gameObjects.length; i++)
    {
        var tempMeshCube = new Mesh();
        tempMeshCube.cubeMesh();
        gameObjects[i].setMesh(tempMeshCube);
    }
}


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.3, 0.3, 0.3, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    initGeometry();

    for (var i = 0; i < gameObjects.length; i++)
        gameObjects[i].initBuffers();

    thetaLoc = gl.getUniformLocation(program, "theta"); 
    
    viewerPos = vec3(0.0, 0.0, -20.0 );

    projection = ortho(-5, 5, -5, 5, -100, 100);
    //projection = perspective(45, 10, 0, 100);
    
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

    render();
}

var render = function ()
{        
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
    if (flag) theta[axis] += 2.0;

    for (var i = 0; i < gameObjects.length; i++)
        renderObject(gameObjects[i]);
          
    requestAnimFrame(render);
}

var initBuffers = function()
{
    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(gameObjects[0].getNormals()), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(gameObjects[0].getVertices()), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
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
    // not very usefull in ortho view, but it shows in the lighting
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
