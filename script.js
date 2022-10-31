document.addEventListener('contextmenu', event => event.preventDefault());

TextColor = ["Black","Blue","Green","Red","Purple","Maroon","Turquoise","Black","Gray"];

Width = 30;
Height = 16;
Bombs = 99;

board = Array(Width).fill(0).map(x => Array(Height).fill(0))

gameTypes = {
    "beginner": {
        W: 9,
        H: 9,
        B: 10
    },
    "intermediate": {
        W: 16,
        H: 16,
        B: 40
    },
    "expert": {
        W: 30,
        H: 16,
        B: 99
    }
}

FirstClick = true;
GameOver = false;

for( i = 0; i < Width; i++){
    for( j = 0; j < Height; j++){        
        var tempTile = document.createElement("div");
        tempTile.className = "tile";
        tempTile.style.position = "absolute";
        tempTile.style.left = 25 * i;
        tempTile.style.top = 25 * j;
        tempTile.onmousedown = click;
        tempTile.x = i;
        tempTile.y = j;
        tempTile.num = 0;
        tempTile.bomb = false;
        tempTile.flag = false;
        tempTile.clicked = false;
        tempTile.clear = 0;
        board[i][j] = tempTile;
        document.getElementById("myDiv").appendChild( tempTile );
    }
}

function customGame(width,height,bombNum){
    Width = width;
    Height = height;
    Bombs = bombNum;
    newGame("custom");
}

function createBomb(x,y){
    
    var bombsLeft = Bombs;

    while( bombsLeft > 0){
        RanX = Math.floor(Math.random() * Width);
        RanY = Math.floor(Math.random() * Height);

        if( !board[RanX][RanY].bomb && !((Math.abs(RanX-x) + Math.abs(RanY-y)) <= 2) ){
            board[RanX][RanY].bomb = true;
            bombsLeft -= 1;
        }
    }
}

function createNumbers(){
    for( i = 0; i < Width; i++){
        for( j = 0; j < Height; j++){
            if(board[i][j].bomb){
                for( k = -1; k < 2; k++){
                    for( l = -1; l < 2; l++){ 
                        try{
                           board[i+k][j+l].num += 1; 
                        } catch(err){}
                    }
                }
            }
        }
    }
}

function isAdjacentToGray(x,y){
    for( a = x - 1; a <= x + 1; a++){
        for( b = y - 1; b <= y + 1; b++){
            try{
                if(board[a][b].clicked == false){
                    return true
                }
            } catch(err){}
        }
    }
    return false
}

function clearZeroes(){
    var toggle = true;
    while( toggle ){
        toggle = false;
        for( i = 0; i < Width; i++){
            for( j = 0; j < Height; j++){
                if( board[i][j].num == 0 && isAdjacentToGray(i,j) && board[i][j].clicked == true){
                    toggle = true;
                    for( k = -1; k < 2; k++){
                        for( l = -1; l < 2; l++){
                            try{
                                board[i+k][j+l].clear = 1;
                            }catch(err){}
                        }
                    }
                }
            }
        }
        for(i = 0; i < Width; i++){
            for( j = 0; j < Height; j++){
                if( board[i][j].clear == 1){
                    clearTile(i,j);
                }
            }
        }
    }  
} 

function click(e){
    if( !GameOver ){
        if( e.which == 1){
            if(FirstClick){
                createBomb(this.x,this.y);
                createNumbers();
                FirstClick = false;
            }
        
            if( !this.flag ){
                clearTile(this.x,this.y);

                if(this.num == 0 ) clearZeroes();   
                if(this.bomb)  GameOver = true; 
            }
        } else if( e.which == 2){

            middleClick(this.x,this.y);

        } else if( e.which == 3){
           flag(this.x,this.y);
        } 

        checkGame();
    }
}

function clearTile(x,y){
    try{
        var tile = board[x][y];
        tile.style.backgroundColor = "lightgrey";
        tile.clicked = true;
        tile.style.color = TextColor[tile.num];
        tile.innerHTML = tile.bomb ? "\u{1F4A3}" : ((tile.num == 0) ? " " : tile.num);
        if(tile.bomb) GameOver = true;
    } catch(err){}
}

function middleClick(x,y){
    var counter = 0;
    for( i = x - 1; i <= x + 1; i++){
        for( j = y - 1; j <= y + 1; j++){
            try{
                if(board[i][j].flag){
                    counter++;
                }
            }catch(err){}
        }
    }
    if( counter == board[x][y].num){
        for( i = -1; i < 2; i++){
            for( j = -1; j < 2; j++){
                try {
                    if( !board[x+i][y+j].flag && !(i==0 && j==0)) clearTile(x+i,y+j);
                } catch(err){}
            }
        }
    }
    clearZeroes();
} 

function flag(x,y){
    var tile = board[x][y];

    if( !tile.clicked ){
        tile.innerHTML = tile.flag ? "" : "\u{1F6A9}";
        tile.flag = !tile.flag;
    }  
} 

function checkGame(){
    if( GameOver == false){
        var counter = 0;
        var counter2 = 0;
        for( i = 0; i < Width; i++){
            for( j = 0; j < Height; j++){
                if(board[i][j].bomb && board[i][j].flag){
                    counter++;
                }
                if(!board[i][j].clicked){
                    counter2++;
                }
            }
        }
        if (counter == Bombs || counter2 == Bombs){
            clearRemaining();
            alert("You won!");
            GameOver = true;
        } 
    } else {
        showRemaining();
    }
}

function clearRemaining(){
    for( i = 0; i < Width; i++){
        for( j = 0; j < Height; j++){
            var tile = board[i][j];
           
            tile.bomb && !tile.clicked ? tile.innerHTML = "\u{1F6A9}" : clearTile(i,j);   
        }
    }
}

function showRemaining(){
    for( i = 0; i < Width; i++){
        for( j = 0; j < Height; j++){
            var tile = board[i][j];
            if (tile.bomb && !tile.flag) tile.innerHTML = "\u{1F4A3}";
        }
    }
}

function newGame(style){
    if(style != "custom"){
        Width = gameTypes[style].W;
        Height = gameTypes[style].H;
        Bombs = gameTypes[style].B;
    } 
    
    if( Bombs > (Width*Height*0.8)){
        Bombs = Width*Height*0.8;
    }

    board = Array(Width).fill(0).map(x => Array(Height).fill(0))

    FirstClick = true;
    GameOver = false;

    document.getElementById("myDiv").innerHTML = "";

    for( i = 0; i < Width; i++){
        for( j = 0; j < Height; j++){        
            var tempTile = document.createElement("div");
            tempTile.className = "tile";
            tempTile.style.position = "absolute";
            tempTile.style.left = 25 * i;
            tempTile.style.top = 25* j;
            tempTile.onmousedown = click;
            tempTile.x = i;
            tempTile.y = j;
            tempTile.num = 0;
            tempTile.bomb = false;
            tempTile.flag = false;
            tempTile.clicked = false;
            tempTile.clear = 0;
            board[i][j] = tempTile;
            document.getElementById("myDiv").appendChild( tempTile );
        }
    }
}
