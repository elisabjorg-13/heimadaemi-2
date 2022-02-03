/////////////////////////////////////////////////////////////////
//    Synidaemi i Tolvugrafik
//     Synir notkun a lyklabordsatburdum til ad hreyfa spada
//
//    Hjalmtyr Hafsteinsson, januar 2022
//
//
//    Utfaersla fyrir Verkefni 1, tolvugrafik 2022
/////////////////////////////////////////////////////////////////
var canvas;
var gl;


var bufferId;
var xmove = 0.0;
var ymove;
var up = true;
var stokk;
var b;
var c;
var score = 0;
var bufferIdScore;
var vPosition;
var colorLoc;
var hittaekki = true;



var vertices = [
    vec2( -0.1, -0.90 ), // nedri
    vec2( -0.1, -0.70 ), // midja
    vec2(  0.05, -0.80 ), // efri


    vec2(-0.5, -0.90),
    vec2(-0.5, -0.75),
    vec2(-0.45, -0.90),

    vec2(-0.5, -0.75),
    vec2(-0.45, -0.75),
    vec2(-0.45, -0.90),

    vec2(0.6, -1.0),
    vec2(0.62, -0.700),
    vec2(0.7, -0.85),

    vec2(0.6, -1.0),
    vec2(0.70, -0.55),
    vec2(0.75, -1.0),

    vec2(0.75, -1.0),
    vec2(0.7, -0.85),
    vec2(0.8,-0.7 ),

    vec2(-1,1),
    vec2(-0.65, 1),
    vec2(-0.65,0.9),

    vec2(-0.75, 0.60),
    vec2(-1, 0.55),
    vec2(-0.75, 0.5),

    vec2(-0.7, 0.6),
    vec2(-0.60, 0.30),
    vec2(-0.9, 0.5),

    vec2(-0.85, 0.5),
    vec2(-0.83, 0.2),
    vec2(-0.6, 0.70),

    vec2(-0.58, 0.82),
    vec2(-0.4, 0.6),

    vec2(0.5, 0.0),
    vec2(0.6, -0.1),
    vec2(0.6, 0.1)



];







window.onload = function init() {

    hreyfing();

    canvas = document.getElementById( "gl-canvas" );
    text= document.getElementById( "text" );
    text.innerHTML = '<span STYLE="font-size:18.0pt"> Mario leikur Elisu - Nadu i bleika kassann til ad fa stig! </SPAN> ';





    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    var ct = canvas.getContext('webgl2');




    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 1.0, 1.0  );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    //
    // bufferIdA = gl.createBuffer();
    // gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdA );
    // gl.bufferData( gl.ARRAY_BUFFER, flatten(kassi), gl.STATIC_DRAW );

    // Load the data into the GPU
    bufferId = gl.createBuffer();
    bufferIdScore = gl.createBuffer();



    // Associate out shader variables with our data buffer
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    colorLoc = gl.getUniformLocation( program, "fColor" );

    function smass(){
      var bila = Math.abs(vertices[2][0] - vertices[32][0]);
      var bilb = Math.abs(vertices[2][0] - vertices[33][0]);
      var bilc = Math.abs(vertices[2][1] - vertices[33][1]);
      var bild = Math.abs(vertices[2][1] - vertices[34][1]);
      if((bila <= 0.2 || bilb <= 0.2)&& (bilc <= 0.2 || bild <= 0.2)){
        hittaekki = false;

      }

    }



    function collision(){
      var bil1 = Math.abs(vertices[2][0] - vertices[3][0]);
      var bil2 = Math.abs(vertices[2][0] - vertices[5][0]);
      var bil3 = Math.abs(vertices[2][1] - vertices[3][1]);
      var bil4 = Math.abs(vertices[2][1] - vertices[4][1]);
      if((bil1 <= 0.1 || bil2 <= 0.1)&& (bil3 <= 0.1 || bil4 <= 0.1)){
        score++;

         a = Math.random();
        if(a > 0.5){
          b = Math.random()*0.6;
          vertices[3][0] = b;
          vertices[3][1] = b - 0.4;
          vertices[4][0] = b;
          vertices[4][1] = b - 0.25;
          vertices[5][0] = b + 0.05;
          vertices[5][1] = b - 0.4;
          vertices[6][0] = b;
          vertices[6][1] = b - 0.25;
          vertices[7][0] = b + 0.05;
          vertices[7][1] = b - 0.25;
          vertices[8][0] = b + 0.05;
          vertices[8][1] = b - 0.4;
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
          render();

      }else{
          c = Math.random()* -0.6;
          vertices[3][0] = c;
          vertices[3][1] = c - 0.4;
          vertices[4][0] = c;
          vertices[4][1] = c - 0.25;
          vertices[5][0] = c + 0.05;
          vertices[5][1] = c - 0.4;
          vertices[6][0] = c;
          vertices[6][1] = c - 0.25;
          vertices[7][0] = c + 0.05;
          vertices[7][1] = c - 0.25;
          vertices[8][0] = c + 0.05;
          vertices[8][1] = c - 0.4;
          gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
          render();


        }


      }
    }


    var haegri = true;

    function update(){
      for(i=0; i<3; i++) {
        vertices[i][0] += xmove;
        vertices[i][1] += ymove;
      }

    }
    function update2(){
      for(i=32; i<35; i++) {
        vertices[i][0] -= xmove2;
      }

    }





    function faerasig(){
      xmove2 = 0.02;
      update2();
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
      render();

    }
    function hreyfing(){
      faersla = setInterval(faerasig, 130);
    }


    function hoppa(){

      if(up){
        if(haegri){
          ymove = 0.08;
          xmove = 0.01;
          update();

        }else {
          ymove = 0.08;
          xmove = -0.01;
          update();

        }
          gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
          render();
          collision();
          if(vertices[0][1] >= 0.0){
            up = false;
          }

        }
        if(up == false){
          if(haegri){
            ymove = -0.07;
            xmove = 0.01;
            update();

          }else {
            ymove = -0.07;
            xmove = -0.01;
            update();

          }


          gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
          render();
          collision();
          smass();
          if(vertices[0][1] <= -0.9){
            clearInterval(stokk);
          }

        }

      }

    // Event listener for keyboard
    window.addEventListener("keydown", function(e){
        switch( e.keyCode ) {


            case 37:	// vinstri or
                // count = 1;
                //mirrorTriangle(1);
                if(score < 10 && hittaekki == true){
                  if (haegri == true) {
                    vertices[2][0] -= 0.3;
                    haegri = false;
                  }

                    xmove = -0.02;
                    ymove = 0.0;

                  for(i=0; i<3; i++) {
                    vertices[i][0] += xmove;
                    vertices[i][1] += ymove;
                  }
                  collision();

                }
                //vertices = vertices2;
                break;
                case 39:
                if(score < 10 && hittaekki == true){
                  if (haegri == false) {
                    vertices[2][0] += 0.3;
                    haegri = true;
                  }


                    xmove = 0.02;
                    ymove = 0.0;





                    for(i=0; i<3; i++) {
                      vertices[i][0] += xmove;
                      vertices[i][1] += ymove;
                  }

                }	// haegri


              collision();
            break;
            case 38:

            up = true;
            vertices[0][1] = -0.90;
            vertices[1][1] = -0.70;
            vertices[2][1] = -0.80;
            if(score < 10 && hittaekki == true){
              stokk = setInterval(hoppa, 20);

            }



              break;


              }


        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
    });
          render();
}

function ut(){
  if(vertices[2][0] < -1.0){
    vertices[2][0] = 1.0;
    vertices[0][0] = 1.15;
    vertices[1][0] = 1.15;

  }
  if(vertices[2][0] > 1.0){
    vertices[2][0] = -1.0;
    vertices[0][0] = -1.15;
    vertices[1][0] = -1.15;

  }

}


function render() {
  ut();
  if(vertices[32][0] < -1.0){
    vertices[32][0] = 1.0;
    vertices[33][0] = 1.15;
    vertices[34][0] = 1.15;
  }





   gl.clear( gl.COLOR_BUFFER_BIT );

   gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
   gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
   gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW );


  gl.uniform4fv( colorLoc, vec4(0.5, 0.5, 0.5, 1.0) );
  gl.drawArrays( gl.TRIANGLES, 0, 3 );

  gl.uniform4fv( colorLoc, vec4(1.0, 0.0, 1.0, 1.0) );
  gl.drawArrays( gl.TRIANGLES, 3, 6);


  gl.uniform4fv( colorLoc, vec4(0.5, 1.0, 0.3, 1.0) );
  gl.drawArrays( gl.TRIANGLES, 9, 9);

  gl.uniform4fv( colorLoc, vec4(1.0, 1.0, 0.0, 1.0) );
  gl.drawArrays( gl.TRIANGLE_FAN, 18, 5);

  gl.uniform4fv( colorLoc, vec4(1.0, 1.0, 0.0, 1.0) );
  gl.drawArrays( gl.TRIANGLES, 23, 12);
  //hér er ég að reyna að teikna inn línur
  for (let i = 0; i<score; i++) {
    var v = [	vec2( -0.9+i*0.09, 0.9),
          vec2( -0.9+i*0.09, 0.8)
    ];
    if (i >= 5) v = [	vec2( -0.8+i*0.09, 0.9),
              vec2( -0.8+i*0.09, 0.8)
          ];
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdScore );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(v), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPosition , 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( colorLoc,vec4(0.0, 0.0, 0.0, 1.0)  );
    gl.drawArrays( gl.LINES, 0, 2 );
  }
  if(score < 10 && hittaekki == true ){
      window.requestAnimFrame(render);

  }else if (score >= 10 && hittaekki == true){
    text.innerHTML = '<span STYLE="font-size:18.0pt"> Thu vannst! </SPAN> ';

  }else{
    text.innerHTML = '<span STYLE="font-size:18.0pt"> Thu tapadir :( </SPAN> ';
  }





}
