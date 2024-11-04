//dichiaro variabili globali: variabili che mi serviranno in tutto il codice, nelle diverse funzioni
//dalla guida --> You can place your variables outside of setup() and draw(). If you create a variable inside of setup(), you can’t use it inside of draw(), so you need to place those variables somewhere else. Such variables are called global variables, because they can be used anywhere (“globally”) in the program.
let columns;
let rows;
let unitsize;
let x0;
let y0;
//definisco una array contenenti i colori che voglio utilizzare in seguito
let colors = ["#5B6952", "#C27B31", "#8E3A22", "#65798D"] 

function setup() {
  createCanvas(windowWidth, windowHeight); 
  setgrid(windowWidth, windowHeight);
  //così il canva viene ridisegnato solo quando la finestra viene ridimensionata o quando si clicca il mouse (vedi fine codice)
  noLoop();
}

//creo la funzione per definire la griglia sulla quale si disegnerà il mio sketch
//qui vengono inzializzate (viene dato il valore di partenza) le variabili che verranno utilizzate in seguito nelle funzioni
//creo la funzione setgrid con i parametri larghezza e altezza che vengono passati da setup (sono la largehzza e l'altezza dello schermo )
function setgrid(width, height) {
  //faccio in modo che la griglia si adatti alla dimensione minima disposinibile tra altezza e larghezza così da avere un layout che si adatti ad ogni dimensione e proporzione dello schermo 
  let dimref = min(width, height);
  //per calcolare la dimensione di ogni unità/modulo della griglia divido la dimensione minima salvata nella variabile dimref per N --> così avrò sempre N righe e tot colonne su schermi orizzontali e N colonne e tot righe su schermi verticali
  unitsize = dimref / 5; //diviso N
  //definisco il numero di colonne facendo larghezza/dimensione dell'unità --> uso floor che mi permette di arrotondare per difetto il risultato della divisione. In questo modo ho un numero di moduli che sicuramente rientra nello schemro e nessuna unità verrà tagliata dallo schermo (e di conseguenza nessun elemento grafico che andrò ad inserire nelle celle)
  columns = floor(width / unitsize);
  //faccio lo stesso con le righe
  rows = floor(height / unitsize);
  //non voglio che la griglia parta attaccata al bordo superiore dello schermo ma vorrei lasciare dei margini ai lati, sopra e sotto, per cui definisco le nuove coordinate di partenza x0 e y0 della griglia
  //per creare un margine uguale a dx e sx faccio larghezza (che è quella dello schermo) - (numero di colonne*misura di ogni modulo) <-- quindi ho larghezza - lo spazio totale che occupa la mia griglia in orizzontale  / 2 <-- così da avere margini pari ai due lati
  x0 = (width - (columns * unitsize)) / 2;
  //stesso procedimento per i margini sup e inf / stessi calcoli sulla direzione verticlae
  y0 = (height - (rows * unitsize)) / 2;
}

function draw() {
  background("#E0D5C9");
  //applico la trasformazione translate per spostare l'origine degli assi nei punti (o meglio nei valori delle coordinate salvati nelle variabili x0 e y0) sopra definiti come x0 e y0
  //dalla guida: translate --> Translates the coordinate system. By default, the origin (0, 0) is at the sketch's top-left corner in 2D mode and center in WebGL mode. The translate() function shifts the origin to a different position.
  translate(x0, y0);
  //per realizzare una griglia composta da righe e colonne uso due cicli for annidati come ho imparato nel primo assignment
  //ciclo for "esterno" per le righe che itera dalla prima riga r=0 finchè r < al numero di righe
  for (let r = 0; r < rows; r++) {
    //ciclo for "interno" per le colonne che itera dalla prima colonna c=0 finchè c < al numero di colonne
    for (let c = 0; c < columns; c++) {
      //isolo le trasformazioni che seguono con push e pop
      push();
      //applico una nuova trasformazione translate per spostare l'origine degli assi di ogni unità o modulo al centro del modulo stesso, quindi l'origine degli assi di ogni cella non è più nella posizione di default in alto a sx ma è spostato al centro dell'unità
      //faccio la trasformazione in modo che avvenga correttamente in qualunque posizione (num riga e num colonna di ogni modulo) della griglia
      // sposto su X di c * grandezza modulo + metà grandezza modulo --> es. prima colonna = 0 + metà modulo // seconda colonna = 1*modulo + metà modulo
      //stessa logica usata lungo la direzione verticale utilizzando il valore di r, ossia delle righe
      translate(c * unitsize + unitsize / 2, r * unitsize + unitsize / 2);
      //voglio applicare una seconda trasformazione ai moduli --> scale 
      //dalla guida: The scale() function scales the current coordinate system by the specified factor.
      //voglio che il valore di riduzione sia casuale tra il 40% e il 90% della dimensione originale per creare disegni di dimensioni diverse e per assicurarmi che, qualora il margine realizzato precedentemente con x0 e y0 non fosse molto grande, i disegni non arrivino troppo a ridosso della fine dello schermo 
      let randomscale = random(0.4, 0.9);
      scale(randomscale);
      //chiamo la funzione drawelements per disegnare gli elementi nei moduli della griglia del mio sketch
      //siccome il parametro della funzione è il "raggio" passo il valore che voglio usare ogni volta (in base allo schermo) // passando la dimensione del raggio in base alle dimensioni del modulo rendo il disegno adattabile alle dimensioni dello schermo
      drawelements(unitsize / 2);
      pop();
    }
  }
}

//funzione drawelements per disegnare gli elementi di ogni modulo 
//il parametro di cui ha bisogno è quello che ho definito come "raggio"
function drawelements(radius) {
  //calcolo il numero delle linee da disegnare in modo randomico
  let linesnum = floor(random(7, 18));
  //il raggio interno (quello che rimane vuoto o verrà riempito da un cerchio) deve essere il 15% del raggio (ossia il 15% della metà del modulo)
  let smallradius = radius * 0.15;
  //creo una variabile spacing che contenga il valore per creare un piccolo distanziamento sia tra le figure piccole sulle linee che tra le figure vicine al centro del modulo / l'eventuale cerchio centrale
  let spacing = 0.03 * unitsize;
  //salvo nella variabile chosencolor uno dei colori della array colors scelto randomicamente grazie alla funzione random 
  //faccio questo passaggio per assicurarmi che ogni elemento della stessa unità (eccetto le linee volutamente diverse) abbia lo stesso colore
  let chosencolor = color(random(colors));

  //per disegnare questi elementi uso un ciclo for
  //i itera da 0 fino al numero randomico di linee scelto in ogni modulo della griglia 
  for (let i = 0; i < linesnum; i++) {
    //creo una variabile angle che mi serve per disegnare delle linee equidistanti (a corretta distanza angolare)
    //2pi è uguale all'angolo giro, dividendo il suo valore per il numero di linee in ogni modulo si ottiene la corretta distanza angolare per disporre equamente le linee in modo radiale. più è alto il numero delle linee minore sarà la distanza angolare tra due linee consecutive
    //moltiplicando la distanza angolare (basata sul numero di linee) per i garantisco il corretto incremento ad ogni iterazione del ciclo 
    //per i=0 l'angolo sarà pari a zero per cui la linea sarà orizzontale // per i=1 l'angolo sarà pari alla distanza calcolata // per i=2 sarà inclinata di due votle la distanza angolare calcolata etc.
    let angle = TWO_PI / linesnum * i;
    //salvo nella variabile linelength la lunghezza della linea (o meglio la sua X finale) che è un valore casuale tra la metà del raggio (valore che ho scelto per avere linee non troppo corte) e il raggio intero 
    let linelength = random(radius * 0.5, radius);
    push();
    //isolo nuovamente le nuove trasformaizoni con push e pop
    //trasformazione rotate 
    //dalla guida: Rotates the coordinate system. By default, the positive x-axis points to the right and the positive y-axis points downward. The rotate() function changes this orientation by rotating the coordinate system about the origin. Everything drawn after rotate() is called will appear to be rotated.
    rotate(angle);
    //imposto lo stoke di colore nero per le linee
    stroke(0); 
    //imposto lo spessore dello stoke randomico e proporizonale alla dimensione del modulo <-- si adatta alle dimensioni dello schermo così da non essere troppo grande/piccolo per lo schermo da cui si visualizza
    strokeWeight(random(0.005 * unitsize, 0.009 * unitsize));
    //disegno la linea che deve avere come x iniziale il raggio piccolo/interno e come x finale la lunghezza scelta randomicamentre sopra. le y di entrambi i punti sono uguali e pari a 0 perchè poggiano sull'asse delle ordinate del nuovo sistema cartesiano di riferimento che è appena stato ruotato di "angle"
    line(smallradius, 0, linelength, 0);

    //ora invece mi occupo delle piccole figure geometriche che vengono disegnate randomicamente sulle linee appena create 
    //vorrei che ci fosse la possibilità di avere 0,1 o 2 figure per ogni linea. Per fare questo salvo in una nuova variabile un numero randomico tra 0 1 2 che userò come condizione del ciclo for utilizzato per il disegno di questi elementi 
    //uso floor(random(0, 3)) perchè random restituisce un numero da 0 compreso a 3 ESCLUSO per definizione, arrotondando per difetto al numero intero gli unici tre valori che può resituirmi sono 0 1 2, ossia i valori desiderati 
    let numshape = floor(random(0, 3)); 
    //uso numshape come condizione di permanenza del ciclo for per le piccole figure disposte sulle linee
    //se numshape è 0 il ciclo non verrà mai eseguito perchè il suo valore iniziale 0 sfora già la condizione di permanenza --> non viene disegnata alcuna figura

    for (let j = 0; j < numshape; j++) {
      //creo la variabile shapex dove verrà salvato il valore della coordinata x da inserire successivamente in circle e square per disegnare le forme quando presenti   
      let shapex;
      //credo due casistiche diverse in base al numero di figure presenti 
      //in questo modo riesco a gestire il caso in cui ho due forme sulla stessa linea --> per evitare la sovrapposizione io ho deciso di adottare questo metodo: la prima figura disegnata sarà nella prima metà della linea, mentre la seconda figura sarà nella seconda metà della linea. 
      //uso il ciclo condizionale 

      //se il numero di figure è 1
      //dalla guida w3: ==	equal to, quindi non basta = come in matematica ma serve ==, non metto === ossia equal value and equal type perchè sto lavorando con numero e numero, non con numero e stringa ad es.
      if (numshape == 1) {
        //la sua x può essere scelta a caso tra l'inizio e la fine della linea tenendo conto del valore di spacing che ho creato prima
        shapex = random(smallradius + spacing, linelength - spacing);
      } //dalla guida w3: Use else if to specify a new condition to test, if the first condition is false
      //quindi se la prima condizione (una sola figura) è falsa, bisogna verificare ora la seconda condizione, ossia che ci siano due figure (numshape == 2)...
        else if (numshape == 2) {
        //se j=0 quindi siamo nella prima iterazione del ciclo for
        if (j == 0) {
          //la x può stare nella prima metà della linea (sempre tenendo conto di spacing)
          shapex = random(smallradius + spacing, linelength/2 - spacing);
        } else {
          //altrimenti (se j=1 quindi siamo nella seconda iterazione del ciclo for) la x può stare nella seconda metà della linea (sempre tenendo conto di spacing)
          shapex = random(linelength/2 + spacing, linelength - spacing);
        }
      }

      //ora mi occupo dei colori degli elementi
      //prima ho fatto in modo che gli elementi dello stesso modulo abbiano lo stesso colore (a parte le linee)
      //ora però vorrei fare in modo che il cerchio centrale, quando presente, fosse del colore del modulo ma in una tonalità molto scura
      //le fomre geometriche sulle linee invece devono assumere una tonalità (sempre del colore del modulo in questione) man mano più chiara all'aumentare della x // più si allontanano dal centro più saranno di una tonalità più chiara

      //ora mi occupo delle figure sulle linee 
      //creo la shade media e quella più chiara che servono per colorare questi elementi
      //nella variabile midshade salvo un nuovo color che vado a creare
      //dalla guida: color () Creates a p5.Color object. By default, the parameters are interpreted as RGB values.
      //questo nuovo color è composto da 3 valori (che sono i tre valori di R G B)

      //dalla guida: red() Gets the red value of a color. red() extracts the red value from a p5.Color object, an array of color components, or a CSS color string.
      //lo stesso vale per blue() e green()
      //quindi innanzitutto estraggo il valore di rosso dal chosencolor (colore del modulo attuale)
      //una volta preso il valore del rosso di chosencolor come valore di partenza vado a modificarlo 
      //moltiplicando ogni componente di R G B per un numero < di 1 si diminuisce la sua intensità rendendolo più scuro rispetto valore originale, avvicinando il colore al nero.

      //per questo motivo moltiplico il valore del rosso originale per n1 (0,...), riducendo la sua intensità al n1*100% dell'originale
      //lo stesso discorso vale per il verde e per il blu, impostati seguendo lo stesso procedimento del rosso
      let midshade = color(red(chosencolor) * 0.7, green(chosencolor) * 0.7, blue(chosencolor) * 0.7);
      //nella variabile lightshade salvo un nuovo color che vado a creare
      //seguo la stessa logica usata per midshade ma qui porto l'intensità delle componenti R G B originali al n2*100% del colore colore originale chosencolor (per andare a tonalità + chiara)
      let lightshade = color(red(chosencolor) * 1.7, green(chosencolor) * 1.7, blue(chosencolor) * 1.7);
      //per far sì che gli elementi assumano una intensità di colore via via maggiore all'aumentare della loro posizione x sfrutto due funzioni di p5.js

      //1) dalla guida p5: lerpColor() blends two colors to find a third color between them.
      // Parameters
      // c1 = p5.Color: interpolate from this color (any value created by the color() function).
      // c2 = p5.Color: interpolate to this color (any value created by the color() function).
      // amt = Number: number between 0 and 1 // The amt parameter specifies the amount to interpolate between the two values. 0 is equal to the first color, 0.1 is very near the first color, 0.5 is halfway between the two colors, and so on. 
      //2) dalla guida p5: map() Re-maps a number from one range to another.
      // Parameters
      // value = Number: the value to be remapped.
      // start1 = Number: lower bound of the value's current range.
      // stop1 = Number: upper bound of the value's current range.
      // start2 = Number: lower bound of the value's target range.
      // stop2 = Number: upper bound of the value's target range.

      //mettendo insieme queste due cose creo il colore da usare per le figure geometriche sulle linee, basato sulla loro posizione x
      //in lerpColor metto come colore di partenza la midshade (realizzata sopra), come colore di arrivo suo lightshade (realizzata sopra), e per fornire l'amount (quindi quanto vicino ad uno dei due colori deve essere il terzo colore creato) uso un'altra funz di p5 ossia map
      //il valore da mappare è shapex quindi la posizione x delle figure
      //dico che il valore della x in smallradius (inizio linea) ora varrà 0 mentre in linelength (fine linea) varrà 1 
      //quindi se una forma ad es. si trova vicino a smallradius (verso l'inzio della riga) il valore che map ritorna sarà qualcosa vicino allo 0 --> questo valore viene usato in lerpColor come atm e quindi crea un colore più simile alla midshade 
      let shapecolor = lerpColor(midshade, lightshade, map(shapex, smallradius, linelength, 0, 1));
      
      //imposto fill e lo stoke per le figure
      fill(shapecolor);
      noStroke(); 
      //disegno le figure geometriche sulle linee
      //voreei 50% di cerchi e 50% di quadrati
      //quindi uso sempre il ciclo condizionale unito a random per generare un numero causale che se < di 0.5 eseguirà qualcosa, altrimenti qualcos'altro 
      if (random() < 0.5) {
        //il raggio dei cerchietti è scelto in modo randomico tra due dimensioni che sono sempre reltaive alla dimensione del modulo per evitare cerchi sproporzionati su schermi molto piccoli o molto grandi
        let circlesize = random(0.02 * unitsize, 0.06 * unitsize);
        //come x del centro metto shapex che è stata calcolata precedentemente in base ad una serie di fattori (vedi sopra)
        //come y del centro metto 0 perchè a seguito della rotazione il centro del cerchio sarà sull'asse delle ordinate del nuovo sistema cartesiano di riferimento che è stato ruotato di "angle"
        //come valore del diametro metto il valore appena scelto casualmente 
        circle(shapex, 0, circlesize);
      } else {
        //anche qui valore randomico lato scelto con lo stesso ragionamento del cerchio 
        let squaresize = random(0.02 * unitsize, 0.04 * unitsize);
        //come x metto shapex (vedi sopra) - metà del lato così da centrare il quadrato in shapex
        //come y metto semplicemente - metà del lato così che il centro poggi sull'asse y (vedi spiegazione in circle) 
        //come lato metto il valore randomico 
        square(shapex - squaresize / 2, -squaresize / 2, squaresize);
      }
    }
    pop();
  }
  //ora disegno il cerchio centrale con il tot % di probabilità, non voglio che sia sempre presente
  //per questo cerchio uso creo una shade più scura del currentcolor del modulo attuale (vedi spiegazione sopra)
  let darkshade = color(red(chosencolor) * 0.5, green(chosencolor) * 0.5, blue(chosencolor) * 0.5);
  fill(darkshade);
  noStroke();
  //uso probabilità per avere solo tot% di cerchi al centro
  if (random() < 0.4) {
  //come x e y metto 0 perchè il centro del cerchio si trova nell'origine del sistema di riferimento di ogni modulo (vedi la trasformaizone translate in draw)
  //come diametro metto smallradius * 2 così da "riempire" lo spazio vuoto che lasciano le linee concentriche
    circle(0, 0, smallradius * 2);
  }
}


// dalla guida: windowResized() --> A function that's called when the browser window is resized. Code placed in the body of windowResized() will run when the browser window's size changes. It's a good place to call resizeCanvas() or make other adjustments to accommodate the new window size.
//dalla guida: resizeCanvas() --> Resizes the canvas to a given width and height.
// resizeCanvas() immediately clears the canvas and calls redraw(). It's common to call resizeCanvas() within the body of windowResized() like so:
// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
// }
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    //quando lo schermo viene ridimensionato, dopo aver ridimensionato la tela chiamiamo la funzione setgrid passando come parametri le nuove dimensioni dello schermo --> in questo modo verrà ricalcolata la griglia di base con le dimensioni attuali per potere aver sempre il layout corretto e desiderato
    setgrid(windowWidth, windowHeight); 
    //infine uso redraw, dalla guida: Runs the code in draw() once. 
    //forzo il ridisegno di draw nel momento in cui viene ridimensionato lo schermo 
    redraw(); 
  }
  
  //per riaggiornare il disegno anche quando lo schermo non viene ridimensionato uso la funzione mousePressed
  //dalla guida: mousePressed() A function that's called once when a mouse button is pressed.Declaring the function mousePressed() sets a code block to run automatically when the user presses a mouse button
  function mousePressed() {
    //e come prima forzo il ridisegno con redraw
    redraw();
  }
  //in questo modo, senza un framerate prestabilito, permetto all'utente di decidere quando riaggiornare il disegno per poter orsservare meglio la struttura, gli elementi geometrici e i colore che ho attribuito ad essi con una logica precisa
  
  //breve speigazione funzionamento di draw e drawelements per capire i cicli for inseriti / il funzionamento del codice
  /* entra nella prima riga, entra nella prima colonna, porta l'origine degli assi al centro del modulo e applica una scalatura randomica, chiama ed esegue la funz drawelements
  drawelements: entra nel ciclo for per le linee e disegna la prima linea ruotata di angle (ruota anche il sist di riferimento)
  entra nel ciclo for delle figure geomtriche, questo può essere eseguito 0 1 o 2 volte
  vengono gestite le posizioni in base al numero di figure (1 o 2) e i colri, vengono disegnate n figure (metà cerchi e metà quadrati)
  chiso il ciclo delle figure entra di nuovo nel ciclo delle linee finchè i < linesnum (ripete iter di prima)
  chiuso anche quel ciclo linee disegna (quando c'è) il cerchio centrale
  finito drawelements entra nella seconda colonna per c=1 e rifà la stessa cosa
  così per tutta la prima riga, esce dalla prima riga entra nella seconda riga e così via finché arriva all'ultima riga */