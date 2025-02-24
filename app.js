document.addEventListener("DOMContentLoaded", ()=>{
    document.body.classList.remove("loading");
})

let card_variants = ["red", "green", "blue", "yellow", "colorchanger", "plus4"]
let card_start_variants = ["red", "green", "blue", "yellow"]
let sub_variants = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-no", "-switch", "-plus2"]
let sub_start_variants = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

var invPlayer = document.getElementById("inventory_player");
var invEnemy = document.getElementById("inventory_enemy");
var cardOnTop = document.getElementById("current_card");

function setRandomCardInfo(card, noImage, isFirstCard)
{
    let fileName = card_variants[Math.floor(Math.random() * card_variants.length)];
    
    if(isFirstCard){
        fileName = card_start_variants[Math.floor(Math.random() * card_start_variants.length)];
    }

    if(fileName != "colorchanger" && fileName != "plus4") // color changer / plus4
    {
        // save color
        card.setAttribute("color", fileName);

        // random number OR no/plus 2/switch
        let cardType = sub_variants[Math.floor(Math.random() * sub_variants.length)];
        if(isFirstCard){
            // first card can't be "-plus2", "switch" or "no"
            cardType = sub_start_variants[Math.floor(Math.random() * sub_start_variants.length)];
        }
        fileName += cardType;

        // save type
        card.setAttribute("type", cardType);
    }else{
        if(fileName == "colorchanger") card.setAttribute("type", "colorchooser");
        else card.setAttribute("type", "plus4");
    }

    if(!noImage) card.src = "cards\\" + fileName + ".svg";
    else card.src = "cards\\empty.svg";
}

function getRandomNumber(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

for(let i=0;i<getCardCount();i++)
{
    setTimeout(()=>
    {
        addCard(invPlayer, false, false);
        addCard(invEnemy, true, false);
    }
    , getRandomNumber(50, 200));
}

// first card
setRandomCardInfo(cardOnTop, false, true);

function placeCardInMiddle(inv, cardItem)
{
    if(cardItem.getAttribute("type") == "plus4"){
        for(let i=0;i<4;i++){
            addCard(invEnemy, true, false);
        }
        inv.removeChild(cardItem);
        return;
    }

    if((cardOnTop.getAttribute("color") != cardItem.getAttribute("color")) && (cardOnTop.getAttribute("type") != cardItem.getAttribute("type")))
    {
        // no
        cardItem.classList.remove("shake");
        cardItem.classList.add("shake");
        new Audio("no.mp3").play();
        return;
    }

    cardOnTop.src = cardItem.src;
    inv.removeChild(cardItem);

    if(cardItem.getAttribute("type") == "-plus2"){
        addCard(invEnemy, true, false);
        addCard(invEnemy, true, false);
    }
}

function addCard(inventory, noImage, isFirstCard)
{
    var newCard = document.createElement("img");
    setRandomCardInfo(newCard, noImage, isFirstCard);

    newCard.addEventListener("click", ()=>{
        placeCardInMiddle(inventory, newCard);
    });
    inventory.appendChild(newCard);
}

function getCardCount()
{
    // try to load "cardCount" => works if user changed
    // this setting. If not, use 9 cards (default) instead.
    return localStorage.getItem("cardCount") || 9;
}

function getMaxCards() // .. on one side, not currently used right now
{
    return Math.floor(window.innerWidth / 240); // 240px: one card
}