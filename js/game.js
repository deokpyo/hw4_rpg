// Global Variables
var first_pick = true;
var player_copy;
var enemy_copy;
var player_selected = "";
var enemy_selected = "";
var base_AP = 0;

// Player Object
var player = {
	P1: {
		name: "Amazon",
		HP: 150,
		AP: 20,
    selected: false,
	},
	P2: {
		name: "Barbarian",
		HP: 200,
		AP: 15,
    selected: false,
	},
	P3: {
		name: "Necromancer",
		HP: 170,
		AP: 18,
    selected: false,
	},
	P4: {
		name: "Paladin",
		HP: 190,
		AP: 17,
    selected: false,
	},
	P5: {
		name: "Sorceress",
		HP: 140,
		AP: 22,
    selected: false,
	},
};

// Enemy Object
var enemy = {
	E1: {
		name: "Andariel",
		HP: 200,
		CAP: 15,
    selected: false,
    dead: false,
	},
	E2: {
		name: "Duriel",
		HP: 300,
		CAP: 20,
    selected: false,
    dead: false,
	},
	E3: {
		name: "Mephisto",
		HP: 400,
		CAP: 22,
    selected: false,
    dead: false,
	},
	E4: {
		name: "Diablo",
		HP: 500,
		CAP: 25,
    selected: false,
    dead: false,
	},
	E5:{
		name: "Baal",
		HP: 600,
		CAP: 30,
    selected: false,
    dead: false,
	},
};

// Game Object
var game = {
    tempDiv: $("<div>"),

    load: function(){
      game.loadPlayer(player);
      game.loadEnemy(enemy);
      $("#select_class").show();
      $("#attack_button").hide();
      $("#reset_button").hide();
      $("#enemy").hide();
      $("#fight").hide();
      $("#fight_enemy").hide();

    },

  // main function to display the player/enemy panel using two inputs
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
      // create a string variable to remove the selected dead enemy from the panel
      var remove_enemy = "div[data-enemy='" + enemy_selected.name + "']";
      $(remove_enemy).remove();
      $(".enemy_panel").show();
      $(".player_panel").css({"overflow":"auto"});
      $("#fight_enemy").hide();
      enemy_selected = "";
    }
    // reset tempDiv for future use
    this.tempDiv = $("<div>");
  },

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

  attackEnemy: function(){
    // attack enemy
    enemy_selected.HP -= player_selected.AP;
    // increase player's AP by base_AP
    player_selected.AP += base_AP;
    if(enemy_selected.HP < 0){
      alert("You Win");
      enemy_selected.selected = false;
      enemy_selected.dead = true;
      $("#attack_button").hide();
      $("#enemy").show();
    }
    else{
      // counter attack player
      player_selected.HP -= enemy_selected.CAP;
      if(player_selected.HP < 0){
        alert("You Lose");
        player_selected.HP = 0;
        $("#attack_button").hide();
        $("#reset_button").show();
      }
    }
    this.loadPlayer(player);
    this.loadEnemy(enemy);
  },

  reset: function(){
    player = player_copy;
    enemy = enemy_copy;
    first_pick = true;
    player_selected = "";
    enemy_selected = "";
    base_AP = 0;
    game.load();
  },
};

$(document).ready(function(){
  // save object copy for reset
  player_copy = player;
  enemy_copy = enemy;
  game.load();
  
  $(".player").on("click", function(){
    var selected = $(this).data("player");
    console.log(selected);
    game.selectPlayer(selected);
    $("#enemy").show();
    $("#select_class").hide();
  });

  $(".enemy").on("click", function(){
    console.log("enemy is selected");
    var selected = $(this).data("enemy");
    game.selectEnemy(selected);
    $("#enemy").hide();
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



