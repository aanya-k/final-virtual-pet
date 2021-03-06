var dogImg, happyDog, dog, sadDog;
var foodS, foodStock, foodObj;
var database;
var feed, add;
var fedTime, lastFed;
var changeGameState, readGameState;
var bedroomImg, washroomImg, gardenImg;
var gameState;

function preload()
{
	dogImg = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");

  bedroomImg = loadImage("images/virtual pet images/Bed Room.png");
  washroomImg = loadImage("images/virtual pet images/Wash Room.png");
  gardenImg = loadImage("images/virtual pet images/Garden.png");

  sadDog = loadImage("images/virtual pet images/Lazy.png");
  
}

function setup() {
	createCanvas(1000, 1000);

  dog = createSprite(720, 220, 50, 80);
  dog.addImage(dogImg);
  dog.scale = 0.2;

  database = firebase.database();
  
  foodStock = database.ref('food');
  foodStock.on("value", readStock);

  feed = createButton("click to feed pet");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  add = createButton("click to add food");
  add.position(825, 95);
  add.mousePressed(addFoods);

  foodObj = new Food();
  
}

function draw() {  
  background(46, 139, 87);

  drawSprites();

  foodObj.display();

  fedTime = database.ref('feedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  })

  if(gameState !== "hungry"){
    feed.hide();
    add.hide();
  }
  else{
    feed.show();
    add.show();
    dog.addImage(sadDog);
  }

  var currentTime = hour();
  if(currentTime == lastFed){
    update("playing");
    foodObj.garden();
  }
  else if(currentTime == lastFed+2){
    update("sleeping");
    foodObj.bedroom();
  }
  else if(currentTime > lastFed+2 && currentTime <= lastFed+4){
    update("bathing");
    foodObj.washroom();
  }
  else{
    update("hungry");
    foodObj.display();
    add.show();
    feed.show();
    
  }
  
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed: " + lastFed%12 + "PM", 350, 30);
  }
  else if(lastFed==0){
    text("Last Feed: 12 AM", 350, 30);
  }
  else{
    text("Last Feed: " + lastFed + "AM", 350, 30);
  }

}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

/*function writeStock(x){
  if(x > 0){
    x = x - 1;
  }
  else if(x <= 0){
    x = 0;
  }

  foodS = x;

  database.ref('/').update({
    food: foodS
  })

}*/

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    food: foodObj.getFoodStock(),
    feedTime: hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    food: foodS
  })
}

function readState(){
  database.ref("gameState").on("value", (data)=>{
    gameState = data.val();
  })
}

function update(state){
  database.ref('/').update({
    gameState: state
  })
}

