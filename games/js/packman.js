var player_canvas = player_context = walls_canvas = walls_context = null;
var in_frame_rate;
var animID_local,death_frame_count = 1;
// var x_inc = 0;
// var y_inc = 0;
var dx_field = 0;
var dy_field =0;
var route_cbx = false;

var anim_frame = {
 	id : 0,
 	dx : 100,
 	dy : 110,
 	x_delta : 26,
 	y_delta : 55,
 	curr_state : 5,
 	// next_state : 5,
 	boundary_value_left: 0,
 	boundary_value_right: 0,
 	boundary_value_top: 0,
 	boundary_value_bottom: 0,
 	next_logical_move : 5,
 	next_logical_dx : 0,
 	next_logical_dy : 0,
 	dwidth : 63,
 	dheight : 74
 };
 
 var CONST = {
 	UP : 3,
 	DOWN : 0,
 	LEFT : 2,
 	RIGHT : 1,
 	DEAD : 4,
 	IDLE_FRONT : 5,
 	IDLE_BACK : 6,
 	IDLE_RIGHT : 7,
 	IDLE_LEFT : 8
 };
 						
 var SpriteArray = [
  				{ pose : "Front", animID : 0, progress : 0.0000, ref_ts : 0.0000, frame_iterator : 1 , row_iterator : 1 , frame_count : 4, row_count : 3, 
  				src : "https://res.cloudinary.com/dpmnlgeqx/image/upload/v1497459149/heroRun01_zdbcfg.png", sx : 0,sy : 0, swidth: 63, sheight: 74, dwidth : 63, dheight : 74, dx : 100, dy : 200},
  				
				{ pose : "Right", animID : 0, progress : 0.0000, ref_ts : 0.0000, frame_iterator : 1 , row_iterator : 1 , frame_count : 4, row_count : 3, 
				src : "https://res.cloudinary.com/dpmnlgeqx/image/upload/v1497459149/heroRun02_zayzjg.png",  sx: 0,sy: 0,swidth: 63, sheight: 74, dwidth : 63, dheight : 74, dx : 200, dy : 250},
				
				{ pose : "Left", animID : 0, progress : 0.0000,  ref_ts : 0.0000, frame_iterator : 1 , row_iterator : 5 , frame_count : 4, row_count : 3, 
				src : "https://res.cloudinary.com/dpmnlgeqx/image/upload/v1497459149/heroRun04_u1mybg.png",sx : 0,sy : 0,swidth: 63, sheight: 74, dwidth : 63, dheight : 74, dx : 300, dy : 100},				
				
				{ pose : "HeroBack", animID : 0, progress : 0.0000,  ref_ts : 0.0000, frame_iterator : 1 , row_iterator : 5 , frame_count : 4, row_count : 3, 
				src : "https://res.cloudinary.com/dpmnlgeqx/image/upload/v1497459149/heroRun03_rh58t1.png",sx : 0,sy : 0,swidth: 63, sheight: 74, dwidth : 63, dheight : 74, dx : 300, dy : 100},
				
	  			{ pose : "Dead" , animID : 0, progress : 0.0000, ref_ts : 0.0000, frame_iterator : 1 , row_iterator : 1 , frame_count : 5, row_count : 5, 
	  			src: "https://res.cloudinary.com/dpmnlgeqx/image/upload/v1497010826/hero_run01/heroDeath01.png", sx : 0,sy : 0,swidth: 63, sheight: 74, dwidth: 63, dheight: 72, dx : 400, dy : 200}, 
	  			
				{ pose : "HeroIdle", animID : 0, progress : 0.0000,  ref_ts : 0.0000, frame_iterator : 1 , row_iterator : 5 , frame_count : 4, row_count : 3, 
				src : "https://res.cloudinary.com/dpmnlgeqx/image/upload/v1497509348/heroIdle01_1_sbfpqf.png",sx : 0,sy : 0,swidth: 63, sheight: 74, dwidth : 63, dheight : 74, dx : 364, dy : 385},	

 				{ pose : "HeroIdle_Back", animID : 0, progress : 0.0000,  ref_ts : 0.0000, frame_iterator : 1 , row_iterator : 5 , frame_count : 4, row_count : 3, 
				src : "https://res.cloudinary.com/dpmnlgeqx/image/upload/v1497543548/heroIdle03_n2mu6j.png",sx : 0,sy : 0,swidth: 63, sheight: 74, dwidth : 63, dheight : 74, dx : 364, dy : 395},
  
   		{ pose : "HeroIdle_Right", animID : 0, progress : 0.0000,  ref_ts : 0.0000, frame_iterator : 1 , row_iterator : 3 , frame_count : 3, row_count : 3, 
				src : "https://res.cloudinary.com/dpmnlgeqx/image/upload/v1497543551/heroIdle02_rewzqv.png",sx : 0,sy : 0,swidth: 63, sheight: 74, dwidth : 63, dheight : 74, dx : 364, dy : 395},	
				
				{ pose : "HeroIdle_Left", animID : 0, progress : 0.0000,  ref_ts : 0.0000, frame_iterator : 1 , row_iterator : 3 , frame_count : 3, row_count : 3, 
				src : "https://res.cloudinary.com/dpmnlgeqx/image/upload/v1498265137/hero_run01/heroIdle04.png",sx : 0,sy : 0,swidth: 63, sheight: 74, dwidth : 63, dheight : 74, dx : 364, dy : 395},												
  
  ];

  var wall_matrix = [[50,50,100,60],[290,184,220,220]];			   

 var cap_matrix2 = [
 					[[60,55],  [120,55],  [184,55],   [248,55],   [310,55],    [480,55], [536,55], [610,55], [670,55],  [730,55]],
 					[[60,105],            [184,105],  [310,105],  [480,105],                       [610,105],          [730,105]],
 					[[60,150], [120,150], [184,150],  [248,150],  [310,150],   [480,150],[536,150],[610,150],[670,150],[730,150]],
 					[ 		   [120,200],             [248,200],     		    		 [536,200],			 [670,200]			],
 					[          [120,240],  			  [248,240],    		    		 [536,240],			 [670,240]			], 					 					
					[          [120,285], [184,285],  [248,285],                         [536,285],[610,285],[670,285]          ], 	
 					[ 		   [120,335],             [248,335],     		    		 [536,335],			 [670,335]			],
 					[          [120,375],  			  [248,375],    		    		 [536,375],			 [670,375]			],
 					[[60,425], [120,425], [184,425],  [248,425],  [310,425],   [480,425],[536,425],[610,425],[670,425],[730,425]],
 					[[60,470], 																							[730,470]],
 					[[60,530],  [120,530],  [184,530],   [248,530],   [310,530], [390,530],   [480,530], [536,530], [610,530], [670,530],  [730,530]]															
 					];
 						
var inner_wall_horizontal_collider = [[70,115,100,5],[200,115,100,5],[325,115,140,5],[495,115,90,5],[615,115,100,5],
 					[135,210,100,5],[260,184,250,220],[550,230,100,5],
 					[130,375,100,5],[550,360,100,5],
 					[70,400,100,5],[200,400,100,5],[325,400,140,5],[490,400,100,5],[615,400,100,5]
 					];
 					
var inner_wall_vertical_collider = [[35,350,5,200],[550,400,5,40]];
 					
 var outer_wall_matrix =[[35,10,340,5],[425,10,340,5],
 						[20,380,60,20],[680,380,90,20],
 						[35,560,720,5]]; 						  
  

var horizontal_Route_Map = [
					[55,735,65],
					[55,735,165],
					[35,260,300],[545,765,300],
					[55,735,440],
					[55,735,545]
					];
					
var vertical_Route_Map = 
					[
						 [65,165,55], [65,165,195], [65,165,325],[65,165,475],[65,165,620],[65,165,730],
									[165,440,125],[165,440,260],[165,440,545],[165,440,670],
						[440,545,55],[440,545,195],[440,545,325],[440,545,475],[440,545,620],[440,545,730]
					];	

  function createSprites(){
 	HeroFrontSprite = new Image();
	HeroFrontSprite.src = SpriteArray[CONST.DOWN].src; 	
	
	HeroRightSprite = new Image();
	HeroRightSprite.src = SpriteArray[1].src;
	
	HeroLeftSprite = new Image();
	HeroLeftSprite.src = SpriteArray[2].src;
	
	HeroBackSprite = new Image();
	HeroBackSprite.src = SpriteArray[3].src;	
	
	DeathSprite = new Image();
	DeathSprite.src = SpriteArray[4].src;
	
	HeroIdle_Sprite = new Image();
	HeroIdle_Sprite.src = SpriteArray[5].src;
	
  	HeroIdle_back_Sprite = new Image();
	HeroIdle_back_Sprite .src = SpriteArray[6].src;
	
	HeroIdle_right_Sprite = new Image();
	HeroIdle_right_Sprite.src = SpriteArray[8].src;
	
	HeroIdle_left_Sprite = new Image();
	HeroIdle_left_Sprite.src = SpriteArray[7].src;	
	
  }
  
  function HeroFrontAnim(ts){
	
	console.log("Hero DOWN \/");

	SpriteAnimator(ts,CONST.DOWN,in_frame_rate);
	  
 }

  
function HeroIdleAnim(ts){
  
	//console.log("Hero Idle __");
	
	anim_frame.dx = SpriteArray[5].dx;
	anim_frame.dy = SpriteArray[5].dy;

	SpriteAnimator(ts,CONST.IDLE_FRONT,150);	
}
  
 function HeroIdle_back_Anim(ts){

	SpriteAnimator(ts,CONST.IDLE_BACK,150);	
} 

 function HeroIdle_right_Anim(ts){

	SpriteAnimator(ts,CONST.IDLE_RIGHT,150);	
} 

 function HeroIdle_left_Anim(ts){

	SpriteAnimator(ts,CONST.IDLE_LEFT,150);	
} 

 function HeroRightAnim(ts){
	
	console.log("Hero RIGHT ->");

	SpriteAnimator(ts,CONST.RIGHT,in_frame_rate);
	  
  }
  function HeroLeftAnim(ts){
	
	console.log("Hero LEFT <-");

	SpriteAnimator(ts,CONST.LEFT,in_frame_rate);
	  
  }
  function HeroBackAnim(ts){
	
	console.log("Hero UP ^");
	  if( Math.abs(anim_frame.dx  - anim_frame.next_logical_dx) <= 4 
  		// || anim_frame.dx <= (anim_frame.next_logical_dx + 4)
  		){
  			cancelAnimationFrame(anim_frame.id);
  			SpriteAnimator(ts,CONST.UP,in_frame_rate);
  		}

  }
    
function determineNextSprite(ts){
	
	var ypos = anim_frame.dy+anim_frame.y_delta;
	var xpos = anim_frame.dx+anim_frame.x_delta;
	
	  if (anim_frame.next_logical_move == CONST.UP && 
	  	(determineAbsoluteOffset((xpos),anim_frame.next_logical_dx) <= 4) &&
	  	 (determineAbsoluteOffset(ypos,anim_frame.next_logical_dy) <= 4) &&
	  	 
	  	 //only down boundary check required for the character to be able to execute a up move		
	  	  (determineOffset((ypos),anim_frame.boundary_value_bottom) >= 0 
	  	  ||
	  	  ((ypos) > anim_frame.boundary_value_top 
	  	  && (ypos) < anim_frame.boundary_value_bottom))
	  	  ){
	  	  	anim_frame.curr_state = CONST.UP;
	  		cancelAnimationFrame(anim_frame.id);
  			SpriteAnimator(ts,CONST.UP,in_frame_rate);		  	  	
	  	  }
	  	  else
	  if (anim_frame.next_logical_move == CONST.DOWN && 
	  	(determineAbsoluteOffset((xpos),anim_frame.next_logical_dx) <= 4) &&
	  	 (determineAbsoluteOffset(ypos,anim_frame.next_logical_dy) <= 4) &&
	  	 
	  	 //only top boundary check required for the character to be able to execute a down move	
	  	  (determineOffset((ypos),anim_frame.boundary_value_top ) <= 0
	  	  ||
	  	  ((ypos) > anim_frame.boundary_value_top 
	  	  && (ypos) < anim_frame.boundary_value_bottom))	  	  
	  	  ){
	  		anim_frame.curr_state = CONST.DOWN;
	  		cancelAnimationFrame(anim_frame.id);
  			SpriteAnimator(ts,CONST.DOWN,in_frame_rate);	
	  } else
	  if (anim_frame.next_logical_move == CONST.LEFT &&
		(determineAbsoluteOffset((xpos),anim_frame.next_logical_dx) <= 4) &&	
		(determineAbsoluteOffset((ypos),anim_frame.next_logical_dy) <= 4) &&
					  		  	
	//only left boundary check required for the character to be able to execute a left move 	  	 
	  	(determineOffset((xpos),anim_frame.boundary_value_left ) >= 0
	  	  ||
	  	  ((xpos) > anim_frame.boundary_value_left 
	  	  && (xpos) < anim_frame.boundary_value_right))		  	 
	  	){
	  		anim_frame.curr_state = CONST.LEFT;
	  		cancelAnimationFrame(anim_frame.id);
  			SpriteAnimator(ts,CONST.LEFT,in_frame_rate);	
	  } else 	  
	  if (anim_frame.next_logical_move == CONST.RIGHT && 
		(determineAbsoluteOffset((xpos),anim_frame.next_logical_dx) <= 4) &&	
		(determineAbsoluteOffset((ypos),anim_frame.next_logical_dy) <= 4) &&
					  		
	  	//only right boundary check required is for the character to be able to execute a right move 
	  	(determineOffset((xpos),anim_frame.boundary_value_right ) <= 0
	  	  ||
	  	  ((xpos) > anim_frame.boundary_value_left 
	  	  && (xpos) < anim_frame.boundary_value_right))		  	
	  	){
	  		
	  		anim_frame.curr_state = CONST.RIGHT;
	  		cancelAnimationFrame(anim_frame.id);
  			SpriteAnimator(ts,CONST.RIGHT,in_frame_rate);	
	  }	 
	  else {
	  	SpriteAnimator(ts,anim_frame.curr_state,in_frame_rate);
	  } 	    
}    
    
function calculateNextLogical_Horizontal_Coordinates(){
	var i, y_offset=0,shortest_distance=999,x_offset_start=0,x_offset_end=0,xpos=0;
	
		//resetting anim_frame.boundary values 
	anim_frame.boundary_value_left = anim_frame.boundary_value_right = 0;
	xpos = anim_frame.dx+anim_frame.x_delta;
	ypos = anim_frame.dy+anim_frame.y_delta;
	
	for (i=0;i<horizontal_Route_Map.length;i++){
		// if(anim_frame.dx >= horizontal_Route_Map[i][0] 
			// && anim_frame.dx  <= horizontal_Route_Map[i][1]){
			
			y_offset = determineOffset(horizontal_Route_Map[i][2] , (ypos));
			x_offset_start = determineAbsoluteOffset(xpos ,horizontal_Route_Map[i][0]);
			x_offset_end = determineAbsoluteOffset(xpos ,horizontal_Route_Map[i][1]);			
			
			//when character is moving upward to the selected path	
			if(anim_frame.curr_state == CONST.UP &&
				 y_offset < 0 && 
				 Math.abs(y_offset) < shortest_distance &&
				//check if the character's x position is at the beginning or end of the horizontal path coordinates
				((x_offset_start <= 4 ||
					x_offset_end <= 4) 
					|| //OR
				//check if the character's x position is in between the horizontal path coordinates
				(xpos > horizontal_Route_Map[i][0] && 
					xpos < horizontal_Route_Map[i][1]))				

				 ){		
				 	if(anim_frame.next_logical_move == CONST.LEFT  &&
				 		determineOffset(horizontal_Route_Map[i][0],(xpos)) >0){
				 			//alert("possible path conflict 1");
				 			continue;
				 	}else
				 	if(anim_frame.next_logical_move == CONST.RIGHT && 
				 		determineOffset(horizontal_Route_Map[i][1],(xpos)) < 0){	
				 			//alert("possible path conflict 2");
				 			continue;	 		
				 	}	
				 						
				anim_frame.next_logical_dy = horizontal_Route_Map[i][2];
				anim_frame.next_logical_dx = xpos;
				shortest_distance = determineAbsoluteOffset(horizontal_Route_Map[i][2],(ypos));
				anim_frame.boundary_value_left = horizontal_Route_Map[i][0];
				anim_frame.boundary_value_right = horizontal_Route_Map[i][1];
									
				
			}
			//character is moving downward to the selected path
			else
			 if(anim_frame.curr_state == CONST.DOWN &&
				y_offset > 0 && 
				y_offset < shortest_distance &&
				//check if the character's x position is at the beginning or end of the horizontal path coordinates
				((x_offset_start <= 4 ||
					x_offset_end <= 4) 
					|| //OR
				//check if the character's x position is in between the horizontal path coordinates
				(xpos > horizontal_Route_Map[i][0] && 
					xpos < horizontal_Route_Map[i][1]))	
				
				
				){
				
				
				anim_frame.next_logical_dy = horizontal_Route_Map[i][2];
				anim_frame.next_logical_dx = xpos;
				shortest_distance = determineAbsoluteOffset(horizontal_Route_Map[i][2],(ypos));
				anim_frame.boundary_value_left = horizontal_Route_Map[i][0];
				anim_frame.boundary_value_right = horizontal_Route_Map[i][1];				
			}
			else 
			if(Math.abs(y_offset) <= 4){
				
				//character is moving on the current path
				anim_frame.next_logical_dy = horizontal_Route_Map[i][2];
				anim_frame.next_logical_dx = xpos;
				shortest_distance = determineAbsoluteOffset(horizontal_Route_Map[i][2],(ypos)); //should be zero
				anim_frame.boundary_value_left = horizontal_Route_Map[i][0];
				anim_frame.boundary_value_right = horizontal_Route_Map[i][1];				
			}
// 			
		// }
	}
		
	if (walls_context != null && route_cbx.checked == true){
			walls_context.strokeStyle="white";
			walls_context.lineWidth="2";
			walls_context.setLineDash([]);
			paintPath();

			walls_context.clearRect(anim_frame.boundary_value_left,anim_frame.next_logical_dy-5,
				determineAbsoluteOffset(anim_frame.boundary_value_left,anim_frame.boundary_value_right),10);
			walls_context.beginPath();
			
			walls_context.strokeStyle="white";
			
						walls_context.setLineDash([5,10]);
			walls_context.moveTo(anim_frame.boundary_value_left,anim_frame.next_logical_dy);
			//walls_context.lineTo(determineAbsoluteOffset(anim_frame.boundary_value_left,anim_frame.boundary_value_right),anim_frame.next_logical_dy);
			walls_context.lineTo(anim_frame.boundary_value_right,anim_frame.next_logical_dy);
			walls_context.stroke();
			
		}	
}  

function calculateNextLogical_Vertical_Coordinates(){
	
	var i, x_offset=0,shortest_distance=999,y_offset_start=0,y_offset_end=0;
	var xpos = anim_frame.dx+anim_frame.x_delta;
	var ypos = anim_frame.dy+anim_frame.y_delta;
	
	//resetting anim_frame.boundary values 
	anim_frame.boundary_value_top = anim_frame.boundary_value_bottom = 0;
	
	for (i=0;i<vertical_Route_Map.length;i++){
		// if(anim_frame.dy >= vertical_Route_Map[i][0] 
			// && anim_frame.dy  <= vertical_Route_Map[i][1]){
			
			x_offset = determineOffset(vertical_Route_Map[i][2] , (xpos));
			y_offset_start = determineAbsoluteOffset(ypos ,vertical_Route_Map[i][0]);
			y_offset_end = determineAbsoluteOffset(ypos ,vertical_Route_Map[i][1]);
			
			if(anim_frame.curr_state == CONST.LEFT && 
				x_offset < 0 && 
				Math.abs(x_offset) < shortest_distance &&
				//check if the character's y position is at the beginning or end of the vertical path coordinates
				((y_offset_start <= 4 || 
					y_offset_end <= 4) 
					|| //OR
				//check if the character's y position is in between the vertical path coordinates
				(ypos > vertical_Route_Map[i][0] && 
					ypos < vertical_Route_Map[i][1]))				
				
				){	
					
					if(anim_frame.next_logical_move == CONST.UP  &&
				 		determineOffset(vertical_Route_Map[i][0],(ypos)) >0){
				 			//alert("possible path conflict 1");
				 			continue;
				 	}else
				 	if(anim_frame.next_logical_move == CONST.DOWN && 
				 		determineOffset(vertical_Route_Map[i][1],(ypos)) < 0){	
				 			//alert("possible path conflict 2");
				 			continue;	 		
				 	}				
											
							
				//character is moving leftward 						
				anim_frame.next_logical_dx = vertical_Route_Map[i][2];
				anim_frame.next_logical_dy = ypos;
				shortest_distance = determineAbsoluteOffset(vertical_Route_Map[i][2],(xpos));
				anim_frame.boundary_value_top = vertical_Route_Map[i][0];
				anim_frame.boundary_value_bottom = vertical_Route_Map[i][1];
									
				
			}else if(anim_frame.curr_state == CONST.RIGHT && 
				x_offset > 0 && 
				Math.abs(x_offset) < shortest_distance &&	
				
				//check if the character's y position is at the beginning or end of the vertical path coordinates
				((y_offset_start <= 4 || 
					y_offset_end <= 4)  
					||//OR
				//check if the character's y position is in between the vertical path coordinates
				(ypos > vertical_Route_Map[i][0] && 
					ypos < vertical_Route_Map[i][1]))
					
					){
						
						//check if previously determined boundary_value_bottom  = boundary_value_top of current path
						if (anim_frame.boundary_value_bottom == vertical_Route_Map[i][0]
							&& anim_frame.next_logical_move == CONST.UP){
							
							//do not update path selection 
								//alert("possible path conflict");
								continue;
							
						}else
						//check if previously determined boundary_value_top = boundary value bottom of current path
						if (anim_frame.boundary_value_top == vertical_Route_Map[i][1]
							&& anim_frame.next_logical_move == CONST.DOWN){
							
							//do not update path selection 
								//alert("possible path conflict");
								continue;
							
						}
						
				
				//character is moving rightward
				anim_frame.next_logical_dx = vertical_Route_Map[i][2];
				anim_frame.next_logical_dy = ypos;
				shortest_distance = determineAbsoluteOffset(vertical_Route_Map[i][2],(xpos));
				anim_frame.boundary_value_top = vertical_Route_Map[i][0];
				anim_frame.boundary_value_bottom = vertical_Route_Map[i][1];				
			}else 
			if(Math.abs(x_offset) <= 4 ){
				
				//character is moving on the current path
				anim_frame.next_logical_dx = vertical_Route_Map[i][2];
				anim_frame.next_logical_dy = ypos;
				shortest_distance = determineAbsoluteOffset(vertical_Route_Map[i][2],(xpos)); //should be zero
				anim_frame.boundary_value_top = vertical_Route_Map[i][0];
				anim_frame.boundary_value_bottom = vertical_Route_Map[i][1];				
			}			
			
		// }

	}	
	
		if (walls_context != null & route_cbx.checked == true){
				walls_context.strokeStyle="white";
			walls_context.lineWidth="2";
			walls_context.setLineDash([]);				
			paintPath();
			walls_context.clearRect(anim_frame.next_logical_dx-5,anim_frame.boundary_value_top,10,
				determineAbsoluteOffset(anim_frame.boundary_value_top,anim_frame.boundary_value_bottom));
			walls_context.beginPath();
			
			walls_context.strokeStyle="white";
			walls_context.setLineDash([5,10]);
			walls_context.moveTo(anim_frame.next_logical_dx,anim_frame.boundary_value_top);
			//walls_context.lineTo(determineAbsoluteOffset(anim_frame.boundary_value_top,anim_frame.boundary_value_bottom),anim_frame.boundary_value_bottom);
			walls_context.lineTo(anim_frame.next_logical_dx,anim_frame.boundary_value_bottom);
			walls_context.stroke();
				
			}			
	
}  
function determineOffset(arg1, arg2){
	return (arg1 - arg2);
}

function determineAbsoluteOffset(arg1, arg2){
	return Math.abs(arg1 - arg2);
}

function SpriteAnimator(ts,idx,frame_rate){
  	

  	  	SpriteArray[idx].progress = ts - SpriteArray[idx].ref_ts;
  	
  	if (SpriteArray[idx].progress > frame_rate) {
  		SpriteArray[idx].ref_ts = ts;
		
  		
  		
  		switch (idx) {
  			case CONST.DOWN :
				  	drawSpriteAnim(CONST.DOWN,HeroFrontSprite); 
				  	break;
  			case CONST.RIGHT :
  			  		drawSpriteAnim(CONST.RIGHT,HeroRightSprite);  
  			  		break;
  			case CONST.LEFT :
  			  		drawSpriteAnim(CONST.LEFT,HeroLeftSprite);  
  			  		break;
  			case CONST.UP :
  			  		drawSpriteAnim(CONST.UP,HeroBackSprite);  
  			  		break;   							
  			case CONST.DEAD :
  			  		drawSpriteAnim(CONST.DEAD,DeathSprite);  
  			  		break;  
  			case CONST.IDLE_BACK :   	
  					drawSpriteAnim(CONST.IDLE_BACK,HeroIdle_back_Sprite); 
	  				break; 			  					  		  			  		  			  		
  			default :
  					drawSpriteAnim(CONST.IDLE_FRONT,HeroIdle_Sprite); 
  					break; 		
  		}
		
  	}
  	
  	if (idx == CONST.DOWN){
  		anim_frame.id = requestAnimationFrame(determineNextSprite);
  	} 
  	else if (idx == CONST.RIGHT){
  		anim_frame.id = requestAnimationFrame(determineNextSprite);
  	} 
  	else if (idx == CONST.LEFT){
  		anim_frame.id = requestAnimationFrame(determineNextSprite);
  	} 
  	else if (idx == CONST.UP){
  		anim_frame.id = requestAnimationFrame(determineNextSprite);
  	} else
  	if (idx == CONST.DEAD){
  		anim_frame.id = requestAnimationFrame(determineNextSprite);
  	} else
  	if (idx == CONST.IDLE_FRONT){
  		anim_frame.id = requestAnimationFrame(determineNextSprite); 		  
  	} else
  	if (idx == CONST.IDLE_BACK){
  		anim_frame.id = requestAnimationFrame(determineNextSprite);
  	}  	  	 	
}
 
  function DeathAnim(ts){

  	SpriteArray[4].progress = ts - SpriteArray[3].ref_ts;
  	
  	if (SpriteArray[4].progress > 150) {
  		SpriteArray[4].ref_ts = ts;
  		death_frame_count++;
  		
  		  anim_frame.id = drawSpriteAnim(4,DeathSprite);  		
  	}
  	
  	if (death_frame_count > SpriteArray[3].frame_count * SpriteArray[3].row_count){
  		 	cancelAnimationFrame(animID_local);
   	  	player_context.clearRect(
 	  		SpriteArray[4].dx,SpriteArray[4].dy,
 	  		SpriteArray[4].dwidth,SpriteArray[4].dheight);		 	
  	} 
  	else {
	   anim_frame.id = requestAnimationFrame(DeathAnim);
  	}
	
  }

 function drawSpriteAnim(idx,sprite_img){
 	
 	var x_inc = 0;
 	var y_inc = 0;
 	
 	switch(idx){
 		
 		case 0:		//move down
 		y_inc = 4;
 		x_inc = 0;
 		break;
 		case 1:		//move right
  		y_inc = 0;
 		x_inc = 4;		
 		break;
 		case 2:		//move left
 		y_inc = 0;
 		x_inc = -4; 		
 		break;
  		case 3:		//move up
 		y_inc = -4;
 		x_inc = 0; 		
 		break;		
 		case 4:	//hero death
 		case 5: //hero_idle_front
 		case 6: //hero_idle_back
 		case 7: //hero_idle_right
 		case 8: //hero_idle_left
 		default:
 		y_inc = 0;
 		x_inc = 0; 		
 		break;
 	}
 	if (player_context != null){

	 	   player_context.clearRect(anim_frame.dx,anim_frame.dy,anim_frame.dwidth,anim_frame.dheight); //clearing last drawn frame by previous sprite
		
			//clear last drawn Stroke Rect by current sprite.
	 	  	 player_context.clearRect(
	 	  		 anim_frame.dx-4,anim_frame.dy-4,
	 	  		 anim_frame.dwidth+10,anim_frame.dheight+10); 
	 	  		 
	 	  	//draw frame_indicator	 
			if (route_cbx  != null && route_cbx.checked == true){
				player_context.strokeStyle = "red";	
				player_context.strokeRect(
					anim_frame.dx+x_inc+anim_frame.x_delta,anim_frame.dy+y_inc,
					5,5);				
			}

		//console.log("drawing anim frame at : ",anim_frame.dx+x_inc, ",",anim_frame.dy+y_inc);
		player_context.drawImage(
				sprite_img,
				SpriteArray[idx].sx,SpriteArray[idx].sy,
				SpriteArray[idx].swidth,SpriteArray[idx].sheight,
				anim_frame.dx+x_inc,anim_frame.dy+y_inc,
				SpriteArray[idx].dwidth,SpriteArray[idx].dheight);	
			SpriteArray[idx].sx = SpriteArray[idx].sx + SpriteArray[idx].swidth;
				SpriteArray[idx].frame_iterator++;
	
	 	//repositioning the animation coordinates to latest sprite location.
	 		anim_frame.dx += x_inc;
	 		anim_frame.dy += y_inc;
	 		
	 		
	 		//reset 
	 		x_inc = y_inc = 0;
	
		     if (SpriteArray[idx].frame_iterator > SpriteArray[idx].frame_count){
		       SpriteArray[idx].sx = 1;
		       SpriteArray[idx].sy = SpriteArray[idx].sy + SpriteArray[idx].sheight;          
		       SpriteArray[idx].frame_iterator = 1;
		       SpriteArray[idx].row_iterator++;
		     }
	
		      if (SpriteArray[idx].row_iterator > SpriteArray[idx].row_count){
		       SpriteArray[idx].row_iterator = 1;
		       SpriteArray[idx].sy = 1; //end of Row 
		     } 			 		
 		
 		}
}

function paintPath(){
	

	
	walls = document.getElementById("walls");
	walls_context = walls.getContext("2d");
	walls_context.beginPath();
	//walls_context.clearRect(0,0,800,600);
	walls_context.strokeStyle = "purple";	
	walls_context.lineWidth="1";
	walls_context.setLineDash([]);
	
	walls_context.moveTo(55,65);
	walls_context.lineTo(735,65);
	walls_context.lineTo(735,165);
	walls_context.lineTo(670,165);
	walls_context.stroke();
	walls_context.beginPath();
		

	walls_context.lineTo(670,165);
	walls_context.lineTo(670,440);
	walls_context.lineTo(740,440);
	walls_context.lineTo(740,545);
	walls_context.lineTo(55,545);
	walls_context.lineTo(55,440);
	walls_context.lineTo(125,440);
	walls_context.lineTo(125,165);
	walls_context.lineTo(55,165);
	walls_context.lineTo(55,65);
	
	
	walls_context.stroke();
	walls_context.beginPath();
	walls_context.strokeStyle = "red";
	walls_context.lineWidth="1";
	walls_context.moveTo(195,65);	
	walls_context.lineTo(195,165);
	walls_context.moveTo(125,165);	
	walls_context.lineTo(670,165);	
	walls_context.moveTo(325,65);	
	walls_context.lineTo(325,165);	
	walls_context.moveTo(475,65);	
	walls_context.lineTo(475,165);	
	walls_context.moveTo(620,65);	
	walls_context.lineTo(620,165);	
	walls_context.moveTo(260,165);	
	walls_context.lineTo(260,440);	
	walls_context.moveTo(545,165);	
	walls_context.lineTo(545,440);	
	walls_context.moveTo(125,440);	
	walls_context.lineTo(670,440);
	walls_context.moveTo(195,440);	
	walls_context.lineTo(195,545);	
	walls_context.moveTo(325,440);	
	walls_context.lineTo(325,545);	
	walls_context.moveTo(475,440);	
	walls_context.lineTo(475,545);		
	walls_context.moveTo(620,440);	
	walls_context.lineTo(620,545);									
	walls_context.stroke();
	
	walls_context.beginPath();
	walls_context.strokeStyle = "orange";
	
//	walls_context.lineWidth="5";	
	walls_context.moveTo(35,300);	
	walls_context.lineTo(260,300);	
	walls_context.moveTo(545,300);	
	walls_context.lineTo(765,300);	

		
	walls_context.stroke();
	
	
}


window.onload = function(){
  	 var animID_main = 0;
  	 var valid_path = false;
	  var wall_canvas = document.getElementById("walls");
	  wall_canvas.style.backgroundImage = "Reference.png";
	  player_canvas = document.getElementById("player");
	  player_context = player_canvas.getContext("2d");
	  player_context.beginPath();
	  player_context.strokeStyle = "red"; 
	  var fps = document.getElementById("fps");
	  fps.value = 40;

	  createSprites();

	  player_canvas.addEventListener("keydown",function(event){
	  	switch(event.keyCode){
	  		case 40 :
	  		anim_frame.next_logical_move = CONST.DOWN;	  		
	  		calculateNextLogical_Vertical_Coordinates();	  		
			animID_main = window.requestAnimationFrame(determineNextSprite); //down
	  		console.log("UP animation ID ", animID_main) ;	
	  		break;
	  		case 37 :  	
	  		anim_frame.next_logical_move = CONST.LEFT;	  		
	  		calculateNextLogical_Horizontal_Coordinates();	  		
			animID_main = window.requestAnimationFrame(determineNextSprite); //left
	  		console.log("UP animation ID ", animID_main) ;		  	
	  		break;
	  		case 38 :  		
	  		anim_frame.next_logical_move = CONST.UP;	  		
	  		calculateNextLogical_Vertical_Coordinates();	  		
			animID_main = window.requestAnimationFrame(determineNextSprite); //UP
	  		console.log("UP animation ID ", animID_main) ;	  			
	  		break;
	  		
	  		case 39 :	  
	  		anim_frame.next_logical_move = CONST.RIGHT;	  		
	  		calculateNextLogical_Horizontal_Coordinates();	  		
			animID_main = window.requestAnimationFrame(determineNextSprite); //RIGHT
	  		console.log("UP animation ID ", animID_main) ;		
	  		break;
	  		
	  		default :
	  		
	  		break;
	  	}
	  }, false);
	  			  
	  player_canvas.addEventListener("mousedown",function(event){
 		console.log("mousedown event") ;

	  	dx_field = document.getElementById("dx");
	  	dy_field = document.getElementById("dy");
	  	dx_field.value = event.offsetX;
	  	dy_field.value = event.offsetY;
	  }, false);
	    
  		var anim_id = window.requestAnimationFrame(HeroIdleAnim); //IDLE
  		//console.log("IDLE animation ID ", anim_id) ;
	
  };
  

function stopAnim(){
	
	cancelAnimationFrame(anim_frame.id);

  	player_context.clearRect(		
	0,0,800,600);
	var walls_canvas = document.getElementById("walls");
	var walls_context = walls_canvas.getContext('2d');
	walls_context.beginPath();
	walls_context.clearRect(0,0,800,600);	
	var caps_canvas = document.getElementById("caps");
	var caps_context = caps_canvas.getContext("2d");
	caps_context.clearRect(0,0,800,600);	
	
}


function startGame(){
	
	document.getElementById("player").focus();
	
	var fps = document.getElementById("fps");
	route_cbx = document.getElementById("route");

	if (fps.value == null){
		in_frame_rate = 1000/20;
	} else {
		in_frame_rate = 1000/fps.value;
	}

	//calling stop anim in case the user clicks the start button more than once, in which case the earlier idle sprite needs to be removed.
	if(anim_frame.id != 0){
	    stopAnim(); 
	}
	//paintProps();
	//paintWalls();
	if(route_cbx.checked == true){
			paintPath();
	}
	
	//set / reset animation to idle state
	anim_frame.curr_state= CONST.IDLE_FRONT;
  	var anim_id = window.requestAnimationFrame(HeroIdleAnim); //IDLE
  	console.log("IDLE animation ID ", anim_id) ;
}
