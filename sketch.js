var dog,sadDog,happyDog;
var lastFed

function preload(){
  sadDog=loadImage("Dog.png");
  happyDog=loadImage("happy dog.png");
  bg = loadImage("VIRTUAL PET BG.jpg");
  milk = loadImage("Milk.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  })

  dog=createSprite(600,250,150,150);
  dog.addImage(sadDog);
  dog.scale=0.25;

  feed = createButton("FEED THE DOG");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("ADD FOOD");
  addFood.position(850,95);
  addFood.mousePressed(addFoods);
  addFood.mouseReleased(mouseReleased);

  name1 = createInput("'NAME'");
  name1.position(880,435);

  bottle = createSprite(500,300,50,50);
  bottle.addImage(milk);
  bottle.scale = 0.065;
  bottle.visible = false;
}

function draw() {
  background(bg);
  foodObj.display();
  foodObj.warning();
  textSize(20);
  fill("black");
  text("FEED YOUR DOG",500,370);
  
  fill("BLACK");
  stroke("black");
  textSize(15);
  if (lastFed>=12) {
    text("LAST FED : " + lastFed%12 + "PM",350,30);
  } else if(lastFed==0){
    text("LAST FED : 12 AM",350,30);
  } else {
    text("LAST FED : " + lastFed + "AM",350,30);
  }

 

  drawSprites();
}

//function to read food Stock
function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog() {
  dog.addImage(happyDog);
  
   foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
   if (foodStock != 0) {
     bottle.visible = true;
   }
   foodObj.getFedTime(lastFed);
   database.ref('/').update({
     Food:foodObj.getFoodStock(),
     FeedTime:hour()
   })
  
}


//function to add food in stock
function addFoods() {

  foodS = foodS + 1;
  database.ref('/').update({
    Food:foodS
  })

}

function mouseReleased() {
  dog.addImage(sadDog);
  bottle.visible= false;
}



