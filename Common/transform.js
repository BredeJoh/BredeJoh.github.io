// fra Andreas Horvik 
// har prøvd endret det til håndtere parent-child forhold, men forholdet mellom rotasjon og scalering ble for mye 
// å legge til for å rotere rundt parent objektene, lignende med skalering.
// det som er kommentert ut, håndterer posisjon i local og world space korrekt.

function Transform(position, rotation, scale)
{
    // local space -position, rotation and scale
    //this.localPosition = position;
    //this.localRotation = rotation;
    //this.localScale = scale;

    // world space - position, rotation and scale
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;

    this.matrix = [];
    this.change = true;
    //this.parent; // this is a transform
    //this.children = []; // this is also transforms
}

Transform.prototype.getMatrix = function()
{
    if(this.change)
        this.updateMatrix();
    return this.matrix;
}

Transform.prototype.updateMatrix = function()
{
    //this.updateTransform();
    this.change = false;
    var mat = mat4();
    mat = mult(mat, translate(this.position[0], this.position[1], this.position[2]));
    mat = mult(mat, rotate(this.rotation[0], 1, 0, 0));
    mat = mult(mat, rotate(this.rotation[1], 0, 1, 0));
    mat = mult(mat, rotate(this.rotation[2], 0, 0, 1));
    mat = mult(mat, scalem(this.scale[0], this.scale[1], this.scale[2]));
    this.matrix = mat;
}

Transform.prototype.setPosition = function(position)
{
    if (position.length == 3)
    {
        this.position = position;
        this.change = true;
        //this.updateTransform();
    }
}

Transform.prototype.setRotation = function (rotation)
{
    if (rotation.length == 3)
    {
        this.rotation = rotation;
        this.change = true;
        //this.updateTransform();
    }
}

Transform.prototype.setScale = function (scale) {
    if (scale.length == 3)
    {
        this.scale = scale;
        this.change = true;
        //this.updateTransform();
    }
}

Transform.prototype.translate = function(by)
{
    if(by.length == 3)
    {
        for(var i=0; i < 3; i++)
            this.position[i] += by[i];

        this.change = true;
        //this.updateTransform();
    }
}

Transform.prototype.rotate = function(by)
{
    if(by.length == 3)
    {
        for(var i=0; i < 3; i++)
            this.rotation[i] += by[i];

        this.change = true;
        //this.updateTransform();
    }
}

Transform.prototype.scalar = function(by)
{
    if(by.length == 3)
    {
        for(var i=0; i < 3; i++)
            this.scale[i] += by[i];

        this.change = true;
        //this.updateTransform();
    }
}
// only for internal use !!!!! as used below
//Transform.prototype.setChild = function(child)
//{
//    // adds child, sets this as childs parent, and updates its transform
//    this.children.push(child); 
//    child.updateTransform();
//}
//
//Transform.prototype.setParent = function(parent)
//{
//    // sets parent to input, set this to parents children and updates transform
//    this.parent = parent; 
//    parent.setChild(this)
//    this.updateTransform();
//}
//
//Transform.prototype.getWorldPosition = function()
//{   //recursive function returns all parent positions in hierarchy and adds them
//    if (this.parent)
//        return add(this.localPosition, this.parent.getWorldPosition());
//    else
//        return this.localPosition;
//}
//
//Transform.prototype.getWorldRotation = function ()
//{   //recursive function returns all parent rotations in hierarchy and adds them
//    if (this.parent)
//        return add(this.localRotation, this.parent.getWorldRotation());
//    else
//        return this.localRotation;
//}
//
//Transform.prototype.getWorldScale = function ()
//{   //recursive function returns all parent scales in hierarchy and adds them
//    if (this.parent)
//        return add(this.localScale, this.parent.getWorldScale());
//    else
//        return this.localScale;
//}

//Transform.prototype.updateTransform = function ()
//{
//    if (this.parent) {
//        this.position = this.getWorldPosition();
//        this.rotation = this.getWorldRotation();
//        this.scale = this.getWorldScale();
//    }
//    else
//    {
//        this.position = this.localPosition;
//        this.rotation = this.localRotation;
//        this.scale = this.localScale;
//    }
//    if (this.children.length != 0) {
//        for (var i = 0; i < this.children.length; i++) {
//            this.children[i].updateTransform();
//        }
//    }
//    this.change = true;
//}