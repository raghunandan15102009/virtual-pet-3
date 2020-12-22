var dog, sadDog, happyDog, database;
var foodS, foodStock;
var fedTime, lastFed;
var feed, addFood;
var foodObj;
var garden, bedroom, bathroom;

function preload() {
  dogImg = loadImage("dogImg.png");
  happyDog = loadImage("dogImg1.png");
  garden = loadImage("Garden.png");
  bedroom = loadImage("Bed Room.png");
  bathroom = loadImage("Wash Room.png");
}


function setup() {
  database = firebase.database();
  createCanvas(1000, 400);
  readState = database.ref('gameState');
  readState.on("value", function (data) {
    gamestate = data.val();
  })
  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  dog = createSprite(800, 200, 150, 150);
  dog.addImage(dogImg);
  dog.scale = 0.15;

  feed = createButton("Feed the dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46, 139, 87);

  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function (data) {
    lastFed = data.val();
  });
  gameState = database.ref('gameState');
  gameState.on("value", function (data) {
    gameState = data.val();
  });

  if(gameState!=="hungry"){
feed.hide();
addFood.hide();
dog.visible=false;
  }else{
    feed.show();
    addFood.show();
    dog.visible=true;
  }
  fill(255, 255, 255);
  textSize(15);
  if (lastFed >= 12) {
    text("Last Feed : " + lastFed % 12 + " PM", 350, 30);
  } else if (lastFed == 0) {
    text("Last Feed : 12 AM", 350, 30);
  } else {
    text("Last Feed : " + lastFed + " AM", 350, 30);
  }

  currenttime = hour();
  if (currenttime == (lastFed + 1)) {
    update("playing");
    foodObj.garden();
  } else if (currenttime == (lastFed + 2)) {
    update("sleeping");
    foodObj.bedroom();
  } else if (currenttime > (lastFed + 2) && currenttime < (lastFed + 4)) {
    update("bathing");
    foodObj.washroom();
  } else {
    update("hungry");
    foodObj.display();
  }
  drawSprites();
}

function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog() {
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

function addFoods() {
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}

function update(state) {
  database.ref('/').update({
    gameState: state
  })
}
