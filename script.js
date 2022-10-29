document.addEventListener('contextmenu', event => event.preventDefault());

TextColor = ["Black","Blue","Green","Red","Purple","Maroon","Turquoise","Black","Gray"];

Width = 30;
Height = 16;
Bombs = 99;

board = Array(Width).fill(0).map(x => Array(Height).fill(0))

FirstClick = true;
GameOver = false;

for( i = 0; i < Width; i++){
    for( j = 0; j < Height; j++){        
        tempTile = document.createElement("div");
        tempTile.className = "tile";
        tempTile.style.position = "absolute";
        tempTile.style.left = 25 * i;
        tempTile.style.top = 25 * j;
        tempTile.onclick = click;
        tempTile.oncontextmenu = flag;
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


function isAdjacent(x1,y1,x2,y2){
    xDif = Math.abs(x1-x2);
    yDif = Math.abs(y1-y2);
    if( (xDif == 1 || xDif == 0) && (yDif == 1 || yDif == 0)){
        return true
    }
    return false
}

function createBomb(x,y){
    bombsLeft = Bombs;
    while( bombsLeft > 0){
        RanX = Math.floor(Math.random() * Width);
        RanY = Math.floor(Math.random() * Height);
        if( !board[RanX][RanY].bomb && !(isAdjacent(x,y,RanX,RanY)) ){
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

function flagRemaining(){
    for( i = 0; i < Width; i++){
        for( j = 0; j < Height; j++){
            if(!board[i][j].clicked){
                board[i][j].innerHTML = "\u{1F6A9}";
            }
        }
    }
    console.log("hello");
}

function checkWin(){
    counter = 0;
    counter2 = 0;
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
        if(counter2 == Bombs){ flagRemaining() }
        alert("You won!");
        GameOver = true;
    }
}

function clearTile(x,y){
    try{
        tile = board[x][y];
        tile.style.backgroundColor = "lightgrey";
        tile.clicked = true;
        tile.style.color = TextColor[tile.num];
        tile.innerHTML = (tile.bomb) ? "\u{1F4A3}" : ((tile.num == 0) ? " " : tile.num);
        
        
    } catch(err){}
}
    
function clearZeroes(){
    toggle = true;
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

function click(){
    if(FirstClick){
        createBomb(this.x,this.y);
        createNumbers();
        FirstClick = false;
    }
  
    if( !this.flag && !GameOver ){
        clearTile(this.x,this.y);

        if( this.num == 0) clearZeroes();   
        if( this.bomb == true) GameOver = true;    
        if( !this.bomb) checkWin();
    }
   
    
}

function flag(){
    if( !this.clicked && !GameOver){
        if(this.flag){
            this.innerHTML = ""
        } else {
            this.innerHTML = "\u{1F6A9}"
        }
        this.flag = !this.flag;

        checkWin();
    }
   
}

function newGame(style){
    switch(style){
        case "b": 
            Width = 9;
            Height = 9;
            Bombs = 10;
            break;
        case "i": 
            Width = 16;
            Height = 16;
            Bombs = 40;
            break;
        case "e": 
            Width = 30;
            Height = 16;
            Bombs = 99;
            break;
        default:
            Width = 10;
            Height = 10;
            Bombs = 5;
    }

    board = Array(Width).fill(0).map(x => Array(Height).fill(0))

    FirstClick = true;
    GameOver = false;

    document.getElementById("myDiv").innerHTML = "";

    for( i = 0; i < Width; i++){
        for( j = 0; j < Height; j++){        
            tempTile = document.createElement("div");
            tempTile.className = "tile";
            tempTile.style.position = "absolute";
            tempTile.style.left = 25 * i;
            tempTile.style.top = 25* j;
            tempTile.onclick = click;
            tempTile.oncontextmenu = flag;
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





