import { Application, Assets,
  Sprite, 
  Container, 
  Graphics,
  Text,
  TextStyle, 
  Texture,
  Rectangle} from "pixi.js";
  
  //undo button: make linked list of added knots...

let cordCoordArray: number[] = [];
let cordCount = 0;
  let xCoord = 0;

function calculateCordPlace(startingCoord: number){

  if(cordCount == 0){
    console.log(cordCount);
    xCoord += startingCoord;
    return xCoord;
  }
  
  else if (cordCount == 7) {
    throw new RangeError("Maximum amount of cords reached!");
  }

  else {
  xCoord = xCoord += 100;
  console.log(xCoord);
  console.log(cordCount);
  cordCoordArray.push(xCoord);
  return xCoord;  
  }
}

function calculateYPlace(cordCount: number){
  switch(cordCount){
      case 0:
      return 145;
      case 1:
      return 155;
      case 2:
      return 162;
      case 3:
      return 167;
      case 4:
      return 165;
      case 5:
      return 155;
  }
}


export function createCord(cordTexture: Texture, x: number, y: number, 
  stageArea: Container){

    const cordSprite = new Sprite(cordTexture);
      cordSprite.width = 28;
      cordSprite.height = 275; 
      cordSprite.eventMode = 'static';
      cordSprite.cursor = 'pointer';
      stageArea.addChild(cordSprite);
      try {
        cordSprite.position.set(calculateCordPlace(x),calculateYPlace(cordCount));
      } catch (error) {
        return null
      };
      cordCount++;
}

export function createKnot(texture: Texture, x: number, y: number,
   stageArea: Container){
        const knotSprite = new Sprite(texture);
        knotSprite.width = 30;
        knotSprite.height = 30;
        knotSprite.position.set(x,y);
        knotSprite.eventMode='static';
        knotSprite.cursor = 'pointer';
        stageArea.addChild(knotSprite);
        return knotSprite;
}

export function showNumberPlaces(shape: Graphics, area: Container){
    shape.eventMode = 'static';

    shape.on('pointerenter', () => {
        shape.alpha = 0.2;
    })

    shape.on('pointerleave', () => {
        shape.alpha = 0;
    })
    
    area.addChild(shape);
}

export function alignKnots(xCoord: number, currentClosestScore: number, i: number){
  if (cordCoordArray.length === 0){
    
    console.log('alignknots called');
    return currentClosestScore;
  }
  else if ((cordCoordArray[i] - xCoord) < (currentClosestScore - xCoord)){
    currentClosestScore = cordCoordArray[i];
    alignKnots(xCoord, currentClosestScore, i+1);
  }
  else {
    alignKnots(xCoord, currentClosestScore, i+1);
  }
  
}



