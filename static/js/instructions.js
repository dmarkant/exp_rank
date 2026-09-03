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
                  'del mostro Verde:');

    self.add_image('static/images/study_example_TI.png', 580, 262);

    self.add_text('e che il mostro Verde è più bravo del mostro Giallo:');


    self.add_image('static/images/study_example_TI_2.png', 580, 262);

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

    self.add_text('Ottimo lavoro!');

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

    self.add_text('Hai finito questo gioco. Se completerai correttamente anche la sessione della prossima '+
                  'settimana riceverai in premio un piccolo e divertente regalo!');
    self.add_text('Grazie per la tua partecipazione.');
	//add_next_instruction_button(function() { Summary(); });

}


var Instructions_Retest_Intro = function() {
	var self = init_instruction(this, 1);

    self.add_text('Bentornato!');

    self.add_text('L’ultima volta che sei stato qui, hai imparato delle cose sulle relazioni fra alcuni mostri. '+
                  'Ti è stato quindi chiesto di dimostrare con un test quanto tu avessi imparato a predire quale '+
                  'tra due mostri fosse il più bravo.');

    self.add_text('In questa fase del gioco sarà eseguita la stessa verifica. Fai del tuo meglio per rispondere '+
                  'nel modo più accurato basandoti su quanto ricordi della precedente sessione.');

    self.add_text('Premi il bottone sottostante quando sei pronto per cominciare!');

	add_next_instruction_button(function() { exp.begin_block(); });
};


var Instructions_Retest_Block = function(blocknum) {
	var self = init_instruction(this, 1);

    if (blocknum==0) {
        $('#header').html('PRIMO TURNO – <i>Fase di verifica</i>');
    } else {
        $('#header').html('SECONDO TURNO – <i>Fase di verifica</i>');
    }

    self.add_text('Adesso vediamo cosa hai imparato sui nostri mostri!');

    s = '<div class="display:block;">';
    if (STUDY_COND[blocknum] == 'active') {
        tmpitems = shuffle(range(activeitems.length));
        for (var i=0; i < activeitems.length; i++) {
            ind = tmpitems[i];
            s += instruction_image_element(IMAGES_ACTIVE[activeitems[ind]], 120, 120, true);
        }
    } else {
        tmpitems = shuffle(range(yokeditems.length));
        for (var i=0; i < yokeditems.length; i++) {
            ind = tmpitems[i];
            s += instruction_image_element(IMAGES_YOKED[yokeditems[ind]], 120, 120, true);
        }
    }
    s += '</div>';
    self.div.append(s);

    self.add_text('Nelle prossime pagine, rispondi alla '+
                  'domanda che compare sullo schermo nel più breve tempo possibile, cercando di essere veloce. '+
                  'Alla fine dell’intero esperimento potrai vedere a quante domande hai risposto correttamente.');

	add_next_instruction_button(function() { exp.test(); });
};


var Instructions_Retest_Finish = function() {
	var self = init_instruction(this, 'retest_finish');
    $('#header').html('Congratulazioni!');
    self.add_image('static/images/fireworks.png', 400, 269);

    self.add_text('Hai finito questo gioco! Grazie per la tua partecipazione.');

}

