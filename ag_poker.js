"use strict";

/*
   New Perspectives on HTML5, CSS3, and JavaScript 6th Edition
   Tutorial 14
   Tutorial Case

   Author: Sabrina Turney
   Date:   12/1/2019
   
   Filename: ag_poker.js

*/

//Create Event Listener to start pokergame:
window.addEventListener("load", playDrawPoker);

//Pokergame function to start:
function playDrawPoker() {
    
    //Declare variables and link to elementIDs.
	var dealButton = document.getElementById("dealB");
	var drawButton = document.getElementById("drawB");
	var standButton = document.getElementById("standB");
	var resetButton = document.getElementById("resetB");
	var handValueText = document.getElementById("handValue");
	var betSelection = document.getElementById("bet");
	var bankBox = document.getElementById("bank");
	var cardImages = document.querySelectorAll("img.cardImg");
	
    
    
    //Initial values of pokerGame when new game is started:
	pokerGame.currentBank = 500;
	pokerGame.currentBet = 25;
	
    
    //New shuffled deck of cards for each game:
	var myDeck = new pokerDeck();
	myDeck.shuffle();
	
    
	//Create the player's "hand" that cards are displayed to.
	var myHand = new pokerHand(5);
	bankBox.value = pokerGame.currentBank;
	betSelection.onchange = function(e) {
		pokerGame.currentBet = parseInt(e.target.options[e.target.selectedIndex].value);
	};
	
	
    
    //Reset button to start a new game.
	resetButton.addEventListener("click", function() {
		pokerGame.currentBank = 500;
		bankBox.value = pokerGame.currentBank;
		enableObj(dealButton);
		enableObj(betSelection);
		disableObj(drawButton);
		disableObj(standButton);
	});
	
    
    
    //After cards are dealt, enable ability to stand and draw.
	dealButton.addEventListener("click", function() {
		if (pokerGame.currentBank >= pokerGame.currentBet) {
			handValueText.textContent = "";
			disableObj(dealButton);
			disableObj(betSelection);
			enableObj(drawButton);
			enableObj(standButton);
			bankBox.value = pokerGame.placeBet();
			
            
            //Deal cards depending on number left in deck.
			if (myDeck.cards.length < 10) {
				myDeck = new pokerDeck();
				myDeck.shuffle();
			}
			myDeck.dealTo(myHand);
			
            
            //Show "cards" by usimg images in folder, or backs by using the back image 
            //file.
			for (var i = 0; i < cardImages.length; ++i) {
				cardImages[i].src = myHand.cards[i].cardImage();
				// event handler for each card image
				cardImages[i].index = i;
				cardImages[i].onclick = function(e) {
					if (e.target.discard !== true) {
						e.target.discard = true;
						e.target.src = "ag_cardback.png";
					} else {
						e.target.discard = false;
						e.target.src = myHand.cards[e.target.index].cardImage();
					}
				};
			}
		} else {
			alert("Reduce the size of your bet");
		}
	});
	
    
    
    //Enable the "deal" and "bet" options after hand is dealt to player:
	drawButton.addEventListener("click", function() {
		enableObj(dealButton);
		enableObj(betSelection);
		disableObj(drawButton);
		disableObj(standButton);
        
		//Replace any cards the player wishes to discard.
		for (var i = 0; i < cardImages.length; ++i) {
			if (cardImages[i].discard) {
				myHand.cards[i].replaceFromDeck(myDeck);
				cardImages[i].src = myHand.cards[i].cardImage();
				cardImages[i].discard = false;
			}
			cardImages[i].onclick = null;
		}
		
        
       
        //Calculate the user's hand:
		handValueText.textContent = myHand.handType();
		
        
        //"Pay" the user on their hand:
		bankBox.value = pokerGame.payout(myHand.handOdds());
	
    });
	standButton.addEventListener("click", function() {
		enableObj(dealButton);
		enableObj(betSelection);
		disableObj(drawButton);
		disableObj(standButton);
		
        //Calculate the user's hand:
		handValueText.textContent = myHand.handType();
		
        //"Pay" for user's hand:
		bankBox.value = pokerGame.payout(myHand.handOdds());
	});
	
	
    //Disable the game.
	function disableObj(obj) {
		obj.disabled = true;
		obj.style.opacity = 0.25;
	}
	
    //Enable the game.
    function enableObj(obj) {
		obj.disabled = false;
		obj.style.opacity = 1;
	}
}