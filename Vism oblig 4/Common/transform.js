// fra Andreas Horvik 

function Transform(position, rotation, scale)
{
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
    this.matrix = [];
    this.change = true;
}

Transform.prototype.getMatrix = function()
{
    if(this.change)
        this.updateMatrix();
    return this.matrix;
}

Transform.prototype.updateMatrix = function()
{
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
    }
}

Transform.prototype.setRotation = function (rotation)
{
    if (rotation.length == 3)
    {
        this.rotation = rotation;
        this.change = true;
    }
}

Transform.prototype.setScale = function (scale) {
    if (scale.length == 3)
    {
        this.scale = scale;
        this.change = true;
    }
}

Transform.prototype.translate = function(by)
{
    if(by.length == 3)
    {
        for(var i=0; i < 3; i++)
            this.position[i] += by[i];

        this.change=true;
    }
}

Transform.prototype.rotate = function(by)
{
    if(by.length == 3)
    {
        for(var i=0; i < 3; i++)
            this.rotation[i] += by[i];

        this.change=true;
    }
}

Transform.prototype.scalar = function(by)
{
    if(by.length == 3)
    {
        for(var i=0; i < 3; i++)
            this.scale[i] += by[i];

        this.change=true;
    }
}