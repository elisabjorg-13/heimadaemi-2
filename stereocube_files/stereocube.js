/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Wíragrindarteningur teiknaður tvisvar frá mismunandi
//     sjónarhorni til að fá víðsjónaráhrif (með gleraugum)
//
//    Hjálmtýr Hafsteinsson, febrúar 2022
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

var NumVertices  = 24;

var points = [];
var colors = [];
var v;

var vBuffer;
var vPosition;
var b;

var movement = false;     // Do we rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var n = 3;

var zDist = -3.0;
var eyesep = 0.2;
var lengd = 1;

var proLoc;
var mvLoc;
var ulfurekki = true;

var kindur = [];

var kind;

var mv;

var tidni = 0;
var tidni2 = 0;
var x_faersla = 0.0;
var y_faersla = 0.0;
var z_faersla = 0.0;

var x_faersla2 = 0.0;
var y_faersla2 = 0.0;
var z_faersla2 = 0.0;

var n = 5;

var x_kvordun = 1.0 * (1/n) - 0.02;
var y_kvordun = 1.0 * (1/n) - 0.02;
var z_kvordun = 1.0 * (1/n) - 0.02;

var x_kvordun2 = 1.0 * (1/n) - 0.02;
var y_kvordun2 = 1.0 * (1/n) - 0.02;
var z_kvordun2 = 1.0 * (1/n) - 0.02;

var x_hnit;
var y_hnit;
var z_hnit;


// the 8 vertices of the cube


 v = [
    vec3( -0.5, -0.5,  0.5 ),
    vec3( -0.5,  0.5,  0.5 ),
    vec3(  0.5,  0.5,  0.5 ),
    vec3(  0.5, -0.5,  0.5 ),
    vec3( -0.5, -0.5, -0.5 ),
    vec3( -0.5,  0.5, -0.5 ),
    vec3(  0.5,  0.5, -0.5 ),
    vec3(  0.5, -0.5, -0.5 )
];

var lines = [ v[0], v[1], v[1], v[2], v[2], v[3], v[3], v[0],
              v[4], v[5], v[5], v[6], v[6], v[7], v[7], v[4],
              v[0], v[4], v[1], v[5], v[2], v[6], v[3], v[7]
            ];



function addKind(mv) {

    mv = mult(mv, translate(x_faersla, y_faersla, z_faersla));
    mv = mult(mv, scalem(x_kvordun, y_kvordun, z_kvordun));
    gl.uniform4fv(colorLoc, vec4(1.5, 0.5, 0.0, 1.0));
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 24);

}

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );



    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }



    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 0.8, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(lines), gl.STATIC_DRAW );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    colorLoc = gl.getUniformLocation( program, "wireColor" );

    proLoc = gl.getUniformLocation( program, "projection" );
    mvLoc = gl.getUniformLocation( program, "modelview" );

    var proj = perspective( 50.0, 1.0, 0.2, 100.0 );
    gl.uniformMatrix4fv(proLoc, false, flatten(proj));

    //event listeners for mouse
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        origX = e.offsetX;
        origY = e.offsetY;
        e.preventDefault();         // Disable drag and drop
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
    	    spinY = ( spinY + (origX - e.offsetX) ) % 360;
            spinX = ( spinX + (e.offsetY - origY) ) % 360;
            origX = e.offsetX;
            origY = e.offsetY;
        }
    } );

    // Event listener for keyboard
     window.addEventListener("keydown", function(e){
         switch( e.keyCode ) {
            case 38:	// upp ör
                zDist += 0.1;
                break;
            case 40:	// niður ör
                zDist -= 0.1;
                break;
         }
     }  );

    // Event listener for mousewheel
     window.addEventListener("mousewheel", function(e){
         if( e.wheelDelta > 0.0 ) {
             zDist += 0.1;
         } else {
             zDist -= 0.1;
         }
     }  );



    render();
}


function hreyfingKind() {

    if (tidni % 107 == 0) {

        faersla = Math.floor(Math.random() * (3 - 1 + 1) + 1);
        minusplus = Math.random();
        if (minusplus < 0.5) {
            formerki = 1;
        }
        else {
            formerki = -1;
        }

        if (faersla == 1) { // faersla i x
          x_faersla = x_faersla + formerki * 1/n;
      }

      else if (faersla == 2) { // faersla i y
        y_faersla = y_faersla + formerki * 1/n;
      }

      else if (faersla == 3) { // faersla i z
        z_faersla = z_faersla + formerki * 1/n;
      }
    }
    tidni = tidni + 4;

    if (x_faersla + x_kvordun/2 > 0.5) {
        x_faersla = -0.5 + x_kvordun/2;
    }

    if (x_faersla - x_kvordun/2 < -0.5) {
        x_faersla = 0.5 - x_kvordun/2;
    }

    if (y_faersla + y_kvordun/2 > 0.5) {
        y_faersla = -0.5 + y_kvordun/2;
    }

    if (y_faersla - y_kvordun/2 < -0.5) {
        y_faersla = 0.5 - y_kvordun/2;
    }

    if (z_faersla + z_kvordun/2 > 0.5) {
        z_faersla = -0.5 + z_kvordun/2;
    }

    if (z_faersla - z_kvordun/2 < -0.5) {
        z_faersla = 0.5 - z_kvordun/2;
    }


}


function drawX(xv){

  for( k = 0; k< n; k ++){
    gl.uniform4fv( colorLoc, vec4(1.0, 0.0, 0.0, 1.0) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(xv));
    gl.drawArrays( gl.LINES, 0, NumVertices );
    xv = mult( xv, translate( 1.0, 0.0, 0.0 ) );
  }

}

function drawZ(zv){
  for( y = 0; y < n; y ++){
    drawX(zv);
    zv = mult( zv, translate( 0.0, 0.0, -1.0 ) );
  }

}

function drawY(yv){
  for( z = 0; z< n; z ++){
    drawZ(yv);
    yv = mult( yv, translate( 0.0, 1.0, 0.0 ) );
  }

}

function kallafaerakind(){
  faerakind(kind);

}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mv = lookAt( vec3(0.0-eyesep/2.0, 0.0, zDist),
                        vec3(0.0, 0.0, zDist+2.0),
                        vec3(0.0, 1.0, 0.0) );
    mv = mult( mv, mult( rotateX(spinX), rotateY(spinY) ) );

      hreyfingKind();
     addKind(mv);

   av = mult( mv, scalem(0.33,0.33,0.33 ) );




    gl.uniform4fv( colorLoc, vec4(1.0, 0.0, 1.0, 1.0) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.LINES, 0, NumVertices );

    av =




    // Vinstra auga...


    // Vinstri mynd er í rauðu...





    // kindID = setInterval(faerakind, 1000)



    requestAnimFrame( render );
}
