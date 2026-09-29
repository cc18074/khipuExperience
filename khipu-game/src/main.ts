import { Application, Assets,
  Sprite, 
  Container, 
  Graphics,
  Text,
  TextStyle, 
  Point, 
  Rectangle,
  FederatedPointerEvent,
  Texture,
  TextureSource} from "pixi.js";

import { createCord, showNumberPlaces, createKnot, alignKnots } from "./positioning";
import { makeKhipu, makeDigitMenu, drawBackground, drawNumPlaces, drawLineGuide, makeCheckAnswerButton, drawTextBox, drawMenuGuide,
  drawLlamas
 } from "./drawing";
import { DoublyLinkedList } from "./DoublyLinkedList";

interface SpriteType extends Sprite {
  spriteType: 'base10' | '9digit' | '8digit' | '7digit' |
 '6digit' | '5 digit' | '4digit' | '3digit' | '2digit' | 'ones'
}

Assets.add({
  alias: 'IBMfont',
  src: 'assets/IBMPlexMono-Regular.ttf'
});

const texturePaths = [
'assets/cord.png',
'assets/checkAnswer.png',
'assets/base10texture.png',
'assets/2digit.png',
'assets/onesTexture.png',
'assets/3digit.png', 
'assets/4digit.png',
'assets/5digit.png',
'assets/6digit.png', 
'assets/7digit.png',
'assets/8digit.png',
'assets/9digit.png',
'assets/textBox.png',
'assets/onesTexture.png',
'assets/cord.png',
'assets/khipuguide.png',
'assets/menuoptions.png',
'assets/khipuGuide1.svg',
'assets/khipu.png',
'assets/exit.png',
'assets/noProgressCord.png',
'assets/hintSprite.png',
'assets/undoButton.png',
'assets/llama.png',
'assets/demoCorrectAnswer.png'
]

const textures = await Assets.load(texturePaths);
const knotList = new DoublyLinkedList();
const exerciseTextData = await Assets.load('/src/exercise1.txt');

let khipuCount = 0;
let targetNum = 6;
let selectedSprite: string | null = null;


const exerciseText = new Text({
  text: exerciseTextData,
  style: {fontSize: 16,
  fontFamily: 'IBMfont'
  }
})
exerciseText.x = 375;
exerciseText.y = 50;

let digitMenuText = new Text({
  text: 2,
  style: {fontSize: 14,
    fontFamily: 'IBMfont'
  },
});

const khipuCounter = new Text({
    text: `Count: ${khipuCount}`,
    style: {
      fontFamily: 'IBMfont',
      fontSize: 20
    }
   });
   khipuCounter.x = 1000;
   khipuCounter.y = 40;

const gameState = {
  validZones: [
    {id: 'hundredsPlace', x: 300, y: 150, width: 700, height: 75, 
      },
    {id: 'tensPlace', x: 200, y: 230, width: 900, height: 70, 
      },
    {id: 'onesPlace', x: 200, y:300, width: 900, height: 80,
      }
  ],
  currentScore : 0,
  digitKnotNum: 1
}



// Creating the initial game stage
async function init() {
  // Create a new application
  const app = new Application();
  app.stage.eventMode = 'static';

  // Initialize the application
  await app.init({ background: "#F7F5EA", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

 // Create and add containers to the stage
  const container = new Container();
  const knotBank = new Container();
  const exerciseDesc = new Container();
  const khipuContainer = new Container();
  
  app.stage.addChild(khipuContainer);
  app.stage.addChild(exerciseDesc);
  app.stage.addChild(knotBank);
  app.stage.addChild(container);

const digitMenu = await makeDigitMenu(digitMenuText, container);

const exitSprite = new Sprite(textures['assets/exit.png']);
container.addChild(exitSprite); 
exitSprite.width = 30;
exitSprite.height = 35;
exitSprite.x = 25;
exitSprite.y = 30;
exitSprite.eventMode = 'static';
exitSprite.cursor = 'pointer';

const undoButtonSprite = new Sprite(textures['assets/undoButton.png']);
container.addChild(undoButtonSprite);
undoButtonSprite.width = 30;
undoButtonSprite.height = 35;
undoButtonSprite.x = 850;
undoButtonSprite.y = 565;
undoButtonSprite.eventMode = 'static';
undoButtonSprite.cursor = 'pointer';


const khipuSprite = new Sprite(textures['assets/khipu.png']);
khipuSprite.x = 200;
khipuSprite.y = 140;
khipuSprite.width = 900;
khipuSprite.height = 300;
container.addChild(khipuSprite);

drawBackground(app, khipuContainer);
drawNumPlaces(khipuContainer);


  const knotBankTexture = await Assets.load('/public/assets/knotbank.png');
  const knotBankSprite = new Sprite(knotBankTexture);
  knotBankSprite.x = 0;
  knotBankSprite.y = 220;
  knotBankSprite.width = 400;
  knotBankSprite.height = 150;
  
  knotBank.addChild(knotBankSprite);


  // Move the container to the center
  knotBank.x = app.screen.width / 2;
  knotBank.y = app.screen.height / 2;

  knotBank.pivot.x = knotBank.width / 2;
  knotBank.pivot.y = knotBank.height / 2;

exerciseDesc.addChild(khipuCounter);



  const khipuHitbox = new Graphics();
  khipuHitbox.rect(310, 150, 650, 275);
  khipuHitbox.fill('yellow');
  khipuHitbox.eventMode = 'static';
  khipuHitbox.alpha = 0;
  container.addChild(khipuHitbox);

 // Create knots and labels
 const onesKnotHitbox = new Graphics();
 onesKnotHitbox.rect(215,225, 50, 80);
 onesKnotHitbox.fill('red');
 knotBank.addChild(onesKnotHitbox);
 onesKnotHitbox.eventMode = 'static';
 onesKnotHitbox.alpha = 0;
 onesKnotHitbox.cursor = 'pointer';

  
 const baseTenHitbox = new Graphics();
 baseTenHitbox.rect(55, 225, 50, 80 );
 baseTenHitbox.fill('green');
 knotBank.addChild(baseTenHitbox);
 baseTenHitbox.eventMode = 'static';
 baseTenHitbox.alpha = 0;
 baseTenHitbox.cursor = 'pointer';

 const digitKnotHitbox = new Graphics();
 digitKnotHitbox.rect(135, 225, 50, 80);
 digitKnotHitbox.fill('blue');
 knotBank.addChild(digitKnotHitbox);
 digitKnotHitbox.eventMode = 'static';
 digitKnotHitbox.alpha = 0;
 digitKnotHitbox.cursor = 'pointer';

 const cordHitbox = new Graphics();
 cordHitbox.rect(280, 225, 60, 80);
 cordHitbox.fill('purple');
 knotBank.addChild(cordHitbox);
 cordHitbox.eventMode = 'static';
 cordHitbox.cursor = 'pointer';
 cordHitbox.alpha = 0;

 const plusSign = new Graphics()
 .rect(595, 435, 20, 20)
 .fill('red');
 plusSign.eventMode = 'static';
container.addChild(plusSign);
 plusSign.alpha = 0;

 const minusSign = new Graphics()
 .rect(545, 435, 20,20)
 .fill('red');
 minusSign.eventMode = 'static';
  container.addChild(minusSign);
 minusSign.alpha = 0;
 

const progressKnot = new Sprite(textures['assets/noProgressCord.png']);
progressKnot.height = 350;
progressKnot.width = 40;
progressKnot.y = 150;
progressKnot.x = 50;
container.addChild(progressKnot);

const observeText = new Text({
  text: "I.  Observe",
  style: {
    fontSize: 16,
    fontFamily: 'IBMFont'
  }
});
observeText.x = 100;
observeText.y = 205;
container.addChild(observeText);

const practiceText = new Text({
  text: "II.  Practice",
  style: {
    fontSize: 16,
    fontFamily: 'IBMFont'
  }
});
practiceText.x = 100;
practiceText.y = 280;
container.addChild(practiceText);


const designText = new Text({
  text: "III.  Design",
  style: {
    fontSize: 16,
    fontFamily: 'IBMFont'
  }
});
designText.x = 100;
designText.y = 355;
container.addChild(designText);


const interpretText = new Text({
  text: "IV.  Interpret",
  style: {
    fontSize: 16,
    fontFamily: 'IBMFont'
  }
});
interpretText.x = 95;
interpretText.y = 430;
container.addChild(interpretText);

drawTextBox(textures['assets/textBox.png'], exerciseDesc);
exerciseDesc.addChild(exerciseText);
drawMenuGuide(textures['assets/menuoptions.png'], container);
drawLlamas(textures['assets/llama.png'], exerciseDesc, 650, 50);
drawLlamas(textures['assets/llama.png'], exerciseDesc, 695, 55);
drawLlamas(textures['assets/llama.png'], exerciseDesc, 750, 39);
drawLlamas(textures['assets/llama.png'], exerciseDesc, 820, 32);
drawLlamas(textures['assets/llama.png'], exerciseDesc, 860, 58);
drawLlamas(textures['assets/llama.png'], exerciseDesc, 910, 37);

const numToTextureMap = new Map();
numToTextureMap.set(2, textures['assets/2digit.png']);
numToTextureMap.set(3, textures['assets/3digit.png']);
numToTextureMap.set(4, textures['assets/4digit.png']);
numToTextureMap.set(5, textures['assets/5digit.png']);
numToTextureMap.set(6, textures['assets/6digit.png']);
numToTextureMap.set(7, textures['assets/7digit.png']);
numToTextureMap.set(8, textures['assets/8digit.png']);
numToTextureMap.set(9, textures['assets/9digit.png']);


 //problem: screen isnt dropping the previously selected sprites! 
 // reassign selected sprite on each click? 
 // selected knot.texture -> if digit knot, make +- menu disappear

 let currentTexture = textures['assets/base10texture.png'];

 function handleKnotClick(){ // switch

  baseTenHitbox.on('pointerdown', (event) => {
    currentTexture = textures['assets/base10texture.png'];
    let newKnot = createKnot(currentTexture, event.global.x, event.global.y,
       khipuContainer);
    knotList.append(newKnot);
    updateCount(event.global.y, 1);
  });

  digitKnotHitbox.on('pointerdown', (event) => {
    currentTexture = textures['assets/9digit.png'];
    let newKnot = createKnot(currentTexture, event.global.x, event.global.y,
       khipuContainer);
    knotList.append(newKnot);
    updateCount(event.global.y, 3);
  })

  onesKnotHitbox.on('pointerdown', (event) => {
    currentTexture = textures['assets/onesTexture.png'];
     let newKnot = createKnot(currentTexture, event.global.x, event.global.y,
       khipuContainer);
    knotList.append(newKnot);
    updateCount(event.global.y, 3);
  })
 }


 function handleB10KnotClick(){
   khipuHitbox.on('pointerdown', (event) => {
    let newKnot = createKnot(textures['assets/base10texture.png'], event.global.x, 
      event.global.y, khipuContainer);
    knotList.append(newKnot);
   // alignKnots(event.global.x, 0, 0);
   if(selectedSprite == null || selectedSprite == "base10"){
      updateCount(event.global.y, 1);
      selectedSprite = null;
   }
    });
 }

 function handleDigitClick(){
   khipuHitbox.on('pointerdown', (event) => {
    let newDknot = createKnot(numToTextureMap.get(Number(digitMenuText.text)),
    event.global.x, event.global.y, khipuContainer);
    knotList.append(newDknot);
    digitMenu.alpha = 0;
    digitMenuText.alpha = 0;
      updateCount(event.global.y, Number(digitMenuText.text));
   }
  );
 }

 function handleOnesClick(){
    khipuHitbox.on('pointerdown', (event) => {
    let newOknot = createKnot(textures['assets/onesTexture.png'], event.global.x,
       event.global.y, khipuContainer);
    knotList.append(newOknot);
   // alignKnots(event.global.x, 0, 0);
    });
    console.log(knotList);
 }


 const checkAnswerButton = 
  makeCheckAnswerButton(textures['assets/checkAnswer.png'],
  container);

 function setupEvents(){

  baseTenHitbox.on('pointerdown', handleB10KnotClick);
  digitKnotHitbox.on('pointerdown', handleDigitClick);
  onesKnotHitbox.on('pointerdown', handleOnesClick);

  digitKnotHitbox.on('pointertap', (event) => {
    digitMenu.alpha = 1;
    digitMenuText.alpha = 1;
  });

  plusSign.on('pointerdown', (event) => {
    if(Number(digitMenuText.text) <= 8){
    let num = Number(digitMenuText.text) + 1;
    digitMenuText.text = num;
    }
  })

   minusSign.on('pointerdown', (event) => {
    if(Number(digitMenuText.text) >= 3){
    let num = Number(digitMenuText.text) - 1;
    digitMenuText.text = num;
    }
  })

  undoButtonSprite.on('pointerdown', (event) => {
    knotList.pop(khipuHitbox);
  })


// last thing to do.. if checkscore is good, update game state to win, and
// evaluate (call a render function?)
 checkAnswerButton.on('pointerdown', (event) => {
  checkScore(targetNum, exerciseDesc, khipuCount);
 });

 cordHitbox.on('pointerdown', (event) => {
  if (createCord(textures['assets/cord.png'], 335,145, khipuContainer) == null){
    cordHitbox.off;
  }
  else {
      createCord(textures['assets/cord.png'], 335,145, khipuContainer);
    }
  },
 )
 }

 setupEvents();
 // when place is clicked: 
 // align knot on nearest cord, update count, 


  // update count
  // add knot to where mouse was clicked
  // how it works: listens to where mouse was clicked -> updates count
  // accordingly, places knot
  // function placeKnot(sprite: Sprite){}


  guideClick(container, app);
  hintClick(container, app);
  

  function checkScore(targetNum: number, container: Container, 
  compareCount: number){
    if (khipuCount == targetNum){
     correctAnswer(container, app);
    }

    if (khipuCount > targetNum){
      const tryAgain = new Text({
      text:'Looks like you went over the target, click reset to try again!'
    })
    container.addChild(tryAgain);
    }
}

function correctAnswer(container: Container, app: Application){
  const correctDemoSprite = new Sprite(textures['assets/demoCorrectAnswer.png']);
   const winnerText = new Text({
      text:'Correct, good job!',
      style: {
        fontFamily: 'IBMFont',
        fontSize: 36
      }
    })

    winnerText.x = 500;
    winnerText.y = 300;
  //   correctDemoSprite.width = 700;
  //   correctDemoSprite.height = 350;

  // const overlay = new Graphics();
  // overlay.rect(0, 0, app.screen.width, app.screen.height);
  // overlay.fill('#000000');
  // overlay.alpha = 0.50;

  // khipuContainer.addChild(overlay);
  // khipuContainer.addChild(correctDemoSprite);
  container.addChild(winnerText);
}


}



function updateCount(y: number, knotValue: number){
  if (y < 200){
    khipuCount = khipuCount + (knotValue * 100);
    khipuCounter.text = `Count: ${khipuCount}`;
    console.log(khipuCount);
  }
  if (y > 200 && y < 300){
    khipuCount = khipuCount + (knotValue * 10);
    khipuCounter.text = `Count: ${khipuCount}`;
    console.log(khipuCount);
  }
  if (y > 300 && y < 500){
    khipuCount = khipuCount + knotValue;
    khipuCounter.text = `Count: ${khipuCount}`;
  }

  console.log('called but not showing');
}

function guideClick(container: Container, app: Application){
  const guideHitbox = new Graphics();
  guideHitbox.rect(1175, 40, 50, 50);
  guideHitbox.fill('red');
  guideHitbox.eventMode = 'static';
  guideHitbox.cursor = 'pointer';
  guideHitbox.alpha = 0;
  container.addChild(guideHitbox);

  const overlay = new Graphics();
  overlay.rect(0, 0, app.screen.width, app.screen.height);
  overlay.fill('#000000');
  overlay.alpha = 0.50;

  const xOut = new Graphics();
  xOut.circle(1000,140,10);
  xOut.fill('blue');
  xOut.alpha = 0;
  xOut.eventMode = 'static';
  xOut.cursor = 'pointer';

  const khipuGuideSprite = new Sprite(textures['assets/khipuGuide1.svg']);
  khipuGuideSprite.width = 750;
  khipuGuideSprite.height = 425;
  khipuGuideSprite.x = 290;
  khipuGuideSprite.y = 100;
  guideHitbox.on('pointerdown', (event) => {
    container.addChild(overlay);
    container.addChild(khipuGuideSprite);
    container.addChild(xOut);
  })
  xOut.on('pointerdown', (event) => {
    container.removeChild(overlay);
    container.removeChild(khipuGuideSprite);
    container.removeChild(xOut);
  })
}

function hintClick(container: Container, app: Application){
  const hintHitbox = new Graphics()
  .rect(1175, 200, 50, 50)
  .fill('purple');
  hintHitbox.eventMode = 'static';
  hintHitbox.cursor = 'pointer';
  hintHitbox.alpha = 0;
  

  const overlay = new Graphics();
  overlay.rect(0, 0, app.screen.width, app.screen.height);
  overlay.fill('#000000');
  overlay.alpha = 0.50;

  const xOut = new Graphics();
  xOut.circle(1000,140,10);
  xOut.fill('blue');
  xOut.alpha = 0;
  xOut.eventMode = 'static';
  xOut.cursor = 'pointer';

  const hintSprite = new Sprite(textures['hintSprite.png']);
  hintSprite.x = 290;
  hintSprite.y = 100;
  hintSprite.width = 500;
  hintSprite.height = 750;


  container.addChild(hintHitbox);

  hintHitbox.on('pointerdown', (event) => {
    container.addChild(overlay);
    container.addChild(hintSprite);
  })
}


init();
