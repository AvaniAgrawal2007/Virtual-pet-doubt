
//Create variables here
var dog, happyDog, dogObj ;
var database, foodS, foodStock;
var feed, addFood, lastFed, fedTime, foodObj;
var database;
var readGameState, changeGameState;
var bedroom, washroom, garden;

function preload()
{
  //load images here 
  dog = loadImage("Dog.png")
  happyDog = loadImage("happyDog.png")
  bedroom = loadImage("virtual pet images/Bed Room.png")
  washroom= loadImage("virtual pet images/Wash Room.png")
  garden = loadImage("virtual pet images/Garden.png")

}

function setup() {
  createCanvas(950, 450);
  database = firebase.database();

  readGameState = database.ref('gameState').once("value",function(data){
    gameState=data.val();
  })
  foodObj = new foodClass()

  dogObj = createSprite(840,270,250,400)
  dogObj.addImage(dog)
  dogObj.scale =0.40;

 feed = createButton("Feed the Dog")
  feed.position(820,250)
  

  addFood = createButton("Add Food")
  addFood.position(830,290)
  

}


function draw() {  
  background(46, 139, 87);

  foodObj.display()
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  feed.mousePressed(feedDog)
  addFood.mousePressed(addFoods)

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime = database.ref('FedTime').once("value", function(data){
    lastFed = data.val();
  });
  
textSize(25)
stroke("black")
fill(39,28,29)
  if (lastFed>=12){
    text("Last Feed : "+ lastFed%12 + "PM", 450,65)
} else if (lastFed===0){
    text("Last Feed : 12 AM", 350,30)
}else{
    text("Last Feed : " + lastFed + "AM", 450,65) 
}


currentTime=hour();
if(currentTime==(lastFed+1)){
update("Playing");
foodObj.garden();
}else if(currentTime==(lastFed+2)){
update("Sleeping");
foodObj.bedroom();
}else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
update("Bathing");
foodObj.bathroom();
}else{
update("Hungry")
foodObj.display();
}

if (gameState!=="Hungry"){
  feed.hide();
  addFood.hide();
}else{  
  feed.show();
  addFood.show();
}
 
  //add styles here
  textSize(30)
  stroke("blue")
  fill("Magenta")
 text ("Food left : "+ foodS ,130,100)

 drawSprites();

}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){

dogObj.addImage(happyDog)
foodObj.updateFoodStock(foodObj.getFoodStock()-1);
 
  database.ref('/').update(
    {
      Food:foodObj.getFoodStock(),
      FeedTime:hour()
    }
  )
}
function addFoods(){
  foodS++

database.ref('/').update(
  {
    Food:foodS
  }
)
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}