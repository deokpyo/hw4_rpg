// Global Variables
var first_pick = true;
var player_copy;
var enemy_copy;
var player_selected = "";
var enemy_selected = "";
var base_AP = 0;
var counter = 0;

// Player Object
var player = {
	P1: {
		name: "Amazon",
		HP: 600,
		AP: 30,
    selected: false,
	},
	P2: {
		name: "Barbarian",
		HP: 1000,
		AP: 15,
    selected: false,
	},
	P3: {
		name: "Necromancer",
		HP: 400,
		AP: 40,
    selected: false,
	},
	P4: {
		name: "Paladin",
		HP: 800,
		AP: 20,
    selected: false,
	},
	P5: {
		name: "Sorceress",
		HP: 300,
		AP: 50,
    selected: false,
	},
};

// Enemy Object
var enemy = {
	E1: {
		name: "Andariel",
		HP: 500,
		CAP: 10,
    selected: false,
    dead: false,
	},
	E2: {
		name: "Duriel",
		HP: 200,
		CAP: 100,
    selected: false,
    dead: false,
	},
	E3: {
		name: "Mephisto",
		HP: 1000,
		CAP: 5,
    selected: false,
    dead: false,
	},
	E4: {
		name: "Diablo",
		HP: 1000,
		CAP: 200,
    selected: false,
    dead: false,
	},
	E5:{
		name: "Baal",
		HP: 2000,
		CAP: 20,
    selected: false,
    dead: false,
	},
};

// Game Object
var game = {

    tempDiv: $("<div>"),
    // function to set up a new game
    load: function(){
      game.loadPlayer(player);
      game.loadEnemy(enemy);
      $("#select_class").show();
      $("#attack_button").hide();
      $("#reset_button").hide();
      $("#enemy").hide();
      $("#fight").hide();
      $("#fight_enemy").hide();
      $("#next_enemy").hide();
      $("#lose").hide();
      $("#win").hide();
      $("#reset").hide();
    },

  // function to display the player/enemy panel using two inputs
  loadGame: function(obj, type){
      var divTag = $("<div>");
      var divCap = $("<div>");
      var imgTag = $("<img>");
      var h3Tag = $("<h3>");
      var h4Tag = $("<h4>");
      divTag.addClass(type + " thumbnail");
      divTag.attr("data-" + type, obj.name);
      divCap.addClass("caption");
      h3Tag.text(obj.name);
      h4Tag.text("HP: " + obj.HP);
      imgTag.attr("src", "images/" + type + "/" + obj.name + ".gif");
      divCap.append(h3Tag);
      divCap.append(h4Tag);
      divTag.append(divCap);
      divTag.append(imgTag);   
      this.tempDiv.append(divTag); 
  },

  // function to load the classes for the player to choose
	loadPlayer: function(str){
    this.tempDiv.addClass("temp_player")
		for(i in str){
      if(str[i].selected || first_pick){
        this.loadGame(str[i], "player"); 
      }
		}
    $(".player_panel").html(this.tempDiv);
    // reset tempDiv for future use
    this.tempDiv = $("<div>");
    //first_pick = false;
	},

  // function to load the enemies for the player to fight against
  loadEnemy: function(str){
    this.tempDiv.addClass("temp_enemy");
    // when first loading all the enemies
    if(first_pick){
      for(i in str){
        this.loadGame(str[i], "enemy");  
      }
      $(".enemy_panel").html(this.tempDiv);
      first_pick = false;
    }
    // when enemy is selected
    if(enemy_selected !== ""){
      this.loadGame(enemy_selected, "enemy");
      $(".fight_panel").html(this.tempDiv);
    }
    // when selected enemy is dead
    if(enemy_selected.dead){
      $("#next_enemy").show();
      // create a string variable to remove the selected dead enemy from the panel
      var remove_enemy = "div[data-enemy='" + enemy_selected.name + "']";
      $(remove_enemy).remove();
      $(".enemy_panel").show();
      $(".player_panel").css({"overflow":"auto"});
      $("#fight_enemy").hide();
      enemy_selected = "";
    }
    // when all the enemies are dead
    if(counter === 5){
      $("#next_enemy").hide();
      $("#enemy").hide();
      $("#attack_button").hide();
      $("#fight_enemy").hide();
      $("#win").show();
      $("#reset").show();
      $("#reset_button").show();
    }
    // reset tempDiv for future use
    this.tempDiv = $("<div>");
  },

  // function for selecting a plyer
  selectPlayer: function(selected){
    for(i in player){
      if(player[i].name === selected){
        player[i].selected = true;
        player_selected = player[i];
        base_AP = player[i].AP;
      }
    }
    this.loadPlayer(player);
  },

  // function for selecting an enemy
  selectEnemy: function(selected){
    this.tempDiv.addClass("temp_enemy");
    for(i in enemy){
      if(enemy[i].name === selected){
        enemy[i].selected = true;
        enemy_selected = enemy[i];
      }
    }
    this.loadEnemy(enemy);
  },

  // function to attack enemy and perform counter attack from the enemy
  attackEnemy: function(){
    // attack enemy
    enemy_selected.HP -= player_selected.AP;
    // increase player's AP by base_AP
    player_selected.AP += base_AP;
    // when enemy is dead
    if(enemy_selected.HP < 0){
      enemy_selected.selected = false;
      enemy_selected.dead = true;
      counter++;
      $("#attack_button").hide();
      $("#enemy").show();
    }
    else{
      // counter attack player
      player_selected.HP -= enemy_selected.CAP;
      // when player is dead
      if(player_selected.HP < 0){
        player_selected.HP = 0;
        $("#attack_button").hide();
        $("#fight_enemy").hide();
        $("#lose").show();
        $("#reset").show();
        $("#reset_button").show(); 
      }
    }
    this.loadPlayer(player);
    this.loadEnemy(enemy);
  },

  // function to reset the variables and objects for a new game
  reset: function(){
    player = player_copy;
    enemy = enemy_copy;
    first_pick = true;
    player_selected = "";
    enemy_selected = "";
    base_AP = 0;
    counter = 0;
    game.load();
  },
};

$(document).ready(function(){
  // save object copy for reset
  player_copy = player;
  enemy_copy = enemy;
  game.load();
  
  // when a class is clicked
  $(".player").on("click", function(){
    var selected = $(this).data("player");
    game.selectPlayer(selected);
    $("#enemy").show();
    $("#select_class").hide();
  });

  // when an enemy is clicked
  $(".enemy").on("click", function(){
    var selected = $(this).data("enemy");
    game.selectEnemy(selected);
    $("#enemy").hide();
    $("#next_enemy").hide();
    $("#fight_enemy").show();
    $("#fight").show();
    $("#attack_button").show();
    $(".player_panel").css({"overflow":"visible"});
  });

  $("#attack_button").on("click", function(){
    game.attackEnemy();
  });

  $("#reset_button").on("click", function(){
    location.reload();
  });
});