instruction_text_element = function(text) {
	return '<div class="instruction-body">'+text+'</div>';
};

instruction_image_element = function(pth, width, height, fl) {
    if (fl) {
        return '<img src='+pth+' width='+width+' height='+height+' style="display:inline; margin-right:5px">';
    } else {
        return '<center><img src='+pth+' width='+width+' height='+height+'></center>';
    }
};


svg_element = function(id, width, height) {
	return '<div class="svg-container" width="'+width+'" height="'+height+'"><svg width="'+width+'" height="'+height+'" id="'+id+'"></svg></div>'
};


function add_next_instruction_button(target) {
    $('#buttons').append('<button id=btn-continue class="btn btn-default btn-lg">AVANTI</button>');

    $('#btn-continue').on('click', function() {
        $(window).unbind('keydown');
        target();
    });

};


function init_instruction(obj, id) {
	obj.id = id;
	output(['instructions', id]);

	psiTurk.showPage('instruct.html');
	obj.div = $('#container-instructions');

	obj.add_text = function(t) {
		obj.div.append(instruction_text_element(t));
	};

    obj.add_image = function(pth, w, h, fl) {
        obj.div.append(instruction_image_element(pth, w, h, fl));
    };

	return obj;
};


var Instructions1 = function() {
	var self = init_instruction(this, 1);

    self.add_text('Benvenuto! In questo esperimento eseguirai un gioco in cui dovrai stabilire '+
                  'una classifica di bravura tra i personaggi immaginari di una storia: Sei piccoli mostri!');

    self.add_text('Ci saranno due turni nel gioco, e ogni turno è diviso in due fasi.');

    self.add_text('Nella <i>prima fase</i> di ogni turno, potrai confrontare la bravura di alcune coppie di mostri '+
                  '(<i>fase di apprendimento</i>). Per esempio, potresti imparare che il mostro Rosa è più bravo '+
                  'del mostro Verde, e che il mostro Verde è più bravo del mostro Giallo.');

    self.add_image('static/images/study_example_TI.png', 644, 290);
    self.add_image('static/images/study_example_TI_2.png', 644, 290);

    self.add_text('Nella <i>seconda fase</i> del turno (<i>fase di verifica</i>) ti verrà chiesto di stabilire una classifica '+
                  'dei mostri in base alla loro bravura sulla base delle informazioni raccolte nella fase precedente.');

    self.add_text('Per esempio, nel caso indicato sopra, chi ritieni che sia il mostro più bravo di tutti, Giallo o Rosa?');

    self.div.append('<button id=btn-A class="btn btn-default btn-lg" style="margin: 30px">Giallo</button>')
    self.div.append('<button id=btn-C class="btn btn-default btn-lg">Rosa</button>')

    self.div.append('<p id=fdbk style="color:red; font-style: italic; visibility: hidden; margin-left: 30px;">No, rileggi le istruzioni e prova ancora...</p>')

    $('#btn-A').on('click', function(e) { $('#fdbk').css('visibility', 'visible')})
    $('#btn-C').on('click', Instructions2);

};


var Instructions2 = function() {
	var self = init_instruction(this, 1);

    self.add_text('Ottimo lavoro. Se completerai il test in modo onesto potrai vincere un buono aggiuntivo di 25 euro!');

    self.add_text('Quindi cerca di fare del tuo meglio durante la prima fase per cercare di capire quali mostri sono più bravi degli altri!');


	add_next_instruction_button(function() { exp.begin_block(); });
};


var InstructionsActiveBlock = function(block) {
	var self = init_instruction(this, 1);

    var comp = ['X', 'Y'][block];

    self.add_text('I mostri della nostra storia (disegnati qui sotto) sono specializzati nella raccolta '+
                  'di frutti magici. Alla fine della giornata, ogni mostro raccoglie sempre lo stesso '+
                  'numero di frutti, e questo numero è diverso da quello degli altri mostri. I mostri '+
                  'più bravi raccolgono un sacco di frutti al giorno; quelli meno bravi raccolgono '+
                  'pochi frutti al giorno.');

    tmpitems = shuffle(range(activeitems.length));
    s = '<div class="display:block;">';
    for (var i=0; i < activeitems.length; i++) {
        ind = tmpitems[i];
        s += instruction_image_element(IMAGES_ACTIVE[activeitems[ind]], 120, 120, true);
    }
    s += '</div>';

    self.div.append(s);


    self.add_text('Nella <i>fase di apprendimento</i> dovrai cercare di <b>capire</b> quali sono i mostri più bravi. '+
                  'Ad ogni passaggio ti verranno proposti due mostri: cliccando sul disegno di uno dei '+
                  'due potrai sapere se raccoglie più o meno frutti di un altro mostro.');

    self.add_text('<b>Il tuo scopo è quello di ricostruire l’intera classifica, dal mostro più bravo a quello '+
                  'meno bravo nella raccolta dei frutti.</b>');

    self.add_text('Nella <i>fase di verifica</i> vedremo se sei riuscito a ricostruire la classifica in modo corretto.');

    self.add_text('Anche se ti sembrerà difficile ricordare tutto, per favore non usare aiuti esterni come carta, '+
                  'penna, telefono, etc. poiché <i>questo invaliderebbe il risultato dello studio, e non avresti la '+
                  'possibilità di ricevere il premio</i>. Semplicemente, cerca di fare del tuo meglio per stabilire '+
                  'la classifica tra i mostri nel tempo che ti verrà dato. ');

    self.add_text('Quando sei pronta/o clicca su “AVANTI” per iniziare. Buon lavoro!');


	add_next_instruction_button(function() { exp.study(); });
};


var InstructionsYokedBlock = function() {
	var self = init_instruction(this, 1);

    self.add_text('I mostri della nostra storia (disegnati qui sotto) sono specializzati nella raccolta '+
                  'di frutti magici. Alla fine della giornata, ogni mostro raccoglie sempre lo stesso '+
                  'numero di frutti, e questo numero è diverso da quello degli altri mostri. I mostri '+
                  'più bravi raccolgono un sacco di frutti al giorno; quelli meno bravi raccolgono '+
                  'pochi frutti al giorno.');


    tmpitems = shuffle(range(yokeditems.length));
    s = '<div class="display:block;">';
    for (var i=0; i < yokeditems.length; i++) {
        ind = tmpitems[i];
        s += instruction_image_element(IMAGES_YOKED[yokeditems[ind]], 120, 120, true);
    }
    s += '</div>';

    self.div.append(s);

    self.add_text('Nella <i>fase di apprendimento</i> dovrai cercare di <b>capire</b> quali sono i mostri più bravi. '+
                  'Ad ogni passaggio ti verranno proposti due mostri: cliccando sul disegno di uno dei '+
                  'due potrai sapere se raccoglie più o meno frutti di un altro mostro.');

    self.add_text('<b>Il tuo scopo è quello di ricostruire l’intera classifica, dal mostro più bravo a quello '+
                  'meno bravo nella raccolta dei frutti.</b>');

    self.add_text('Nella <i>fase di verifica</i> vedremo se sei riuscito a ricostruire la classifica in modo corretto.');

    self.add_text('Anche se ti sembrerà difficile ricordare tutto, per favore non usare aiuti esterni come carta, '+
                  'penna, telefono, etc. poiché <i>questo invaliderebbe il risultato dello studio, e non avresti la '+
                  'possibilità di ricevere il premio</i>. Semplicemente, cerca di fare del tuo meglio per stabilire '+
                  'la classifica tra i mostri nel tempo che ti verrà dato. ');

    self.add_text('Quando sei pronta/o clicca su “AVANTI” per iniziare. Buon lavoro!');


	add_next_instruction_button(function() { exp.study(); });
};





var InstructionsTest = function(blocknum) {
	var self = init_instruction(this, 1);

    if (blocknum==0) {
        $('.h1').html('PRIMO TURNO – <i>Fase di verifica</i>');
    } else {
        $('.h1').html('SECONDO TURNO – <i>Fase di verifica</i>');
    }

    self.add_text('Adesso vediamo cosa hai imparato sui nostri mostri!');

    self.add_text('Nelle prossime pagine, rispondi alla '+
                  'domanda che compare sullo schermo nel più breve tempo possibile, cercando di essere veloce. '+
                  'Alla fine dell’intero esperimento potrai vedere a quante domande hai risposto correttamente.');

	add_next_instruction_button(function() { exp.test(); });
};

var Instructions_Finish = function() {
	var self = init_instruction(this, 'test');
    $('#header').html('Congratulazioni!');
    self.add_image('static/images/fireworks.png', 400, 269);

    self.add_text('Gioco completato! Hai finito questo gioco! Ricorda che per ricevere il buono di 15 euro devi '+
                  'completare entrambi i giochi indicati sulla mail, sia questa che la prossima settimana, quando '+
                  'riceverai una seconda mail. E ricorda che ci sono anche due premi da 25 euro in palio per i '+
                  'migliori partecipanti!');
    self.add_text('Grazie per la tua partecipazione.');
	//add_next_instruction_button(function() { Summary(); });

}


/*
var InstructionsRetest = function() {
	var self = init_instruction(this, 1);


    self.add_text('Welcome back! Last time you were here, you learned about the relationships between ' +
                  'people in two fictional companies (one made up of women and a second made of up men). ' +
                  'In this session you will be tested on how much you can remember. As in the last session, ' +
                  'please do your best to respond as accurately as possible.');

    self.add_text('If you have any questions, please alert the experimenter. Otherwise, press the button ' +
                  'below to begin the test when you are ready. Good luck!');

	add_next_instruction_button(function() { exp.begin_block(); });
};
*/
