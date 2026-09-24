import { Application, Assets, Container, Graphics, Sprite, Text, Texture } from "pixi.js";

export function makeKhipu(container: Container){
  // Create khipu lines 
    const topLine = new Graphics()
    .moveTo(350,150)
    .lineTo(950,150)
    .stroke({
      color: 'BurlyWood',
      width: 8
    })
    container.addChild(topLine);
    
    const leftLine = new Graphics()
    .moveTo(350,150)
    .lineTo(200,350)
    .stroke({
      color: 'BurlyWood',
      width: 8
    })
    container.addChild(leftLine);
  
     const rightLine = new Graphics()
    .moveTo(950,150)
    .lineTo(1100,350)
    .stroke({
      color: 'BurlyWood',
      width: 8
    })
    container.addChild(rightLine);
}

export async function makeDigitMenu(digitMenuText: Text, container: Container){
  
  digitMenuText.x = 575;
  digitMenuText.y = 437;
  digitMenuText.eventMode = 'static';
  digitMenuText.cursor = 'pointer';
  digitMenuText.alpha = 0;

  const digitMenuTexture = await Assets.load('/public/assets/digitMenu.png');
   const digitMenuSprite = new Sprite(digitMenuTexture);
   digitMenuSprite.x = 530;
   digitMenuSprite.y = 390;
   digitMenuSprite.width = 150;
   digitMenuSprite.height = 100;
   container.addChild(digitMenuSprite);
   digitMenuSprite.alpha = 0;
  container.addChild(digitMenuText);

  return digitMenuSprite;
};

export async function drawBackground(app: Application, container: Container){
  const backgroundTexture = await Assets.load('/public/assets/background.png');
   const backgroundSprite = new Sprite(backgroundTexture);
   backgroundSprite.width = app.screen.width;
   backgroundSprite.height = app.screen.height;
   container.addChild(backgroundSprite);
}

export async function drawNumPlaces(container: Container){
    const hundredsLine = new Graphics()
  .moveTo(200,210)
  .lineTo(1100, 210)
  .stroke({
    width: 5,
    color: 'red'
  });
  hundredsLine.alpha = 0.10;
  container.addChild(hundredsLine);

  const tensLine = new Graphics()
  .moveTo(100,300)
  .lineTo(1200, 300)
  .stroke({
    width: 5,
    color: 'red'
  });
  tensLine.alpha = 0.10;
  container.addChild(tensLine);
}

export async function drawKnotBank(container: Container){
  const knotBankTexture = await Assets.load('/public/assets/knotbank.png');
  const knotBankSprite = new Sprite(knotBankTexture);
  knotBankSprite.x = 0;
  knotBankSprite.y = 220;
  knotBankSprite.width = 400;
  knotBankSprite.height = 150;
  container.addChild(knotBankSprite);
}

export async function drawKhipuCounter(count: Number, container: Container){
  let khipuCounter = new Text({
      text: `Count: ${count}`
     });
     khipuCounter.x = 1000;
     khipuCounter.y = 40;
     container.addChild(khipuCounter);

     return khipuCounter;
}

export async function drawLineGuide(app: Application, container: Container){
   // red line guide
  const guideTexture = await Assets.load('/public/assets/guide.png');
  const guideSprite = new Sprite(guideTexture);
  guideSprite.width = app.screen.width;
  guideSprite.height = app.screen.height;
  container.addChild(guideSprite);
}

export function makeCheckAnswerButton(texture: Texture, container: Container) {
   const checkAnswerButton = new Sprite(texture);
 checkAnswerButton.x = 950;
 checkAnswerButton.y = 550;
 checkAnswerButton.width = 180;
 checkAnswerButton.height = 40;
 checkAnswerButton.cursor = 'pointer';
 checkAnswerButton.eventMode = 'static';
 container.addChild(checkAnswerButton);

 return checkAnswerButton;
}

export function drawTextBox(texture: Texture, container: Container){
const textBox = new Sprite(texture);
container.addChild(textBox);
textBox.width = 650;
textBox.height = 90;
textBox.x = 325;
textBox.y = 25;
}

export function drawMenuGuide(texture: Texture, container: Container){
  const menuSprite = new Sprite(texture);
  container.addChild(menuSprite);
  menuSprite.height = 300;
  menuSprite.width = 50;
  menuSprite.x = 1175;
  menuSprite.y = 40;
}