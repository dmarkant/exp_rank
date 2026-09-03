/*
 * Rank - Italian version
 */

var	version = 1.0,
	TESTING = false,
	SEED = false, // no yoking yet
	N_ITEMS = 6,
	N_STUDY_TRIALS = 30,
	N_TEST_TRIALS = undefined, // if undefined, determined below
	STUDY_NROWS = 2,
	STUDY_NCOLS = 2,
	N_BLOCKS = 2,
	STUDY_FRAME_DELAY = 500,
	STUDY_DURATION = 2000, // 'none' | 'selfpaced' | fixed t
	STAGE_ASPECT = .7,
	STAGE_HEIGHT = 700,
	STAGE_WIDTH = 800,
	BREAK_DURATION = 120, // seconds
	STUDY_COND,
	IMAGES_ACTIVE,
	IMAGES_YOKED,
	exp,
	active_item = undefined,
	yokeddata = [],
	stimuli,
	testitems,
	test_items_selected,
	test_accuracy = [[], []],
	outpfx = [],
	timeouts = [],
	partnerdata = [],
	ids = uniqueId.split(':'),
	block_start_time,
	sampled_options = [[], []];


if (TESTING) {
	BREAK_DURATION = 10;
	N_STUDY_TRIALS = 2;
	N_TEST_TRIALS = 2;
}


// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);
var LOGGING = true;
var SAVEDATA = true;
var SKIP_INSTRUCTIONS = false;
var SIMULATE = false;

// Generic function for saving data
function output(arr) {
	arr = outpfx.concat(arr);
    if (SAVEDATA) psiTurk.recordTrialData(arr);
    if (LOGGING) console.log(arr.join(" "));
};


// For this yoked, lab-only experiment, the uniqueId
// has the format <new participant id>:<partner id>
var partnerid = ids[1];
counterbalance = Number(counterbalance);
output(['counterbalance', counterbalance]);
STUDY_COND = shuffle(['active', 'yoked']);
if (Math.random() < .5) {
	IMAGES_ACTIVE = IMAGES_SHAPES;
	IMAGES_YOKED = IMAGES_COLORS;
} else {
	IMAGES_ACTIVE = IMAGES_COLORS;
	IMAGES_YOKED = IMAGES_SHAPES;
}

// If retesting a participant, treat it as a
// seed since there is no yoked partner
var RETEST = (ids[0].indexOf('-retest') > -1);

// in passive study, equal probability of selecting
// near and far images
var DIST_PASSIVE = shuffle(_.map(_.range(N_STUDY_TRIALS), function(i) { return i % 2; }));



/*
// Loading data for yoked partner
var partner_result = [];
if (!SEED) {
	output(['requesting partner data']);
	$.ajax({url: 'partnerdata',
			data: 'partnerid='+partnerid,
			type: 'GET',
			async: false,
			timeout: 10000,
			dataType: 'json',
			success: function(data) {
				output(['retrieved partner data']);
				partner_result = data;
			},
			error: function(jqXHR, textStatus, errorThrown) {
				output(['failed to retrieve data for partner: '+partnerid]);
				output(['switching to active only!']);
				SEED = true;
			}
	});

	pd = _.map(partner_result['partner_data'], function(x) { return x['trialdata']; });



	partner_study_cond = _.filter(pd, function(row) { return row[0]=='study_cond'; })[0].slice(1,3);
	partner_image_type = _.filter(pd, function(row) { return row[0]=='image_type'; })[0].slice(1,3);

	partner_active_items = _.filter(pd, function(row) { return row[0]=='activeitems'; })[0].slice(1,10);
	partner_yoked_items = _.filter(pd, function(row) { return row[0]=='yokeditems'; })[0].slice(1,10);

	partner_active_images = _.filter(pd, function(row) { return row[0]=='activeimages'; })[0].slice(1,10);
	partner_yoked_images = _.filter(pd, function(row) { return row[0]=='yokedimages'; })[0].slice(1,10);

	partner_testitems_active = _.filter(pd, function(row) { return row[0]=='testitems' & row[2]=='active'; })[0].slice(3,75);
	partner_testitems_yoked = _.filter(pd, function(row) { return row[0]=='testitems' & row[2]=='yoked'; })[0].slice(3,75);



	// matching order of study conditions
	STUDY_COND = partner_study_cond;

	// swap images and indices
	IMAGE_TYPE = (partner_image_type[0]=='men') ? ['women', 'men'] : ['men', 'women'];
	//IMAGES_ACTIVE = partner_yoked_images;
	//IMAGES_YOKED = partner_active_images;


	if (IMAGE_TYPE[0]=='men') {
		if (STUDY_COND[0]=='active') {
			IMAGES_ACTIVE = IMAGES_MEN;
			IMAGES_YOKED = IMAGES_WOMEN;
		} else {
			IMAGES_ACTIVE = IMAGES_WOMEN;
			IMAGES_YOKED = IMAGES_MEN;
		}
	} else {
		if (STUDY_COND[0]=='active') {
			IMAGES_ACTIVE = IMAGES_WOMEN;
			IMAGES_YOKED = IMAGES_MEN;
		} else {
			IMAGES_ACTIVE = IMAGES_MEN;
			IMAGES_YOKED = IMAGES_WOMEN;
		}
	}


}
*/

// If this is a retest, load data from first session
var prev_test_data = [];
if (RETEST) {
	output(['requesting data from first session']);
	$.ajax({url: 'participantdata',
			data: 'participantid='+ids[0].slice(0, ids[0].indexOf('-retest')),
			type: 'GET',
			async: false,
			timeout: 10000,
			dataType: 'json',
			success: function(data) {
				output(['retrieved participant data']);
				prev_test_data = data['participant_data'];
				prev_test_data = _.map(prev_test_data, function(x) { return x['trialdata']; });
			},
			error: function(jqXHR, textStatus, errorThrown) {
				output(['failed to retrieve data for participant: '+ids[0]]);
				RETEST = false;
			}
	});


	/*

	IMAGE_TYPE = _.filter(prev_test_data, function(row) { return row[0]=='image_type'})[0].slice(1,3)

	if (IMAGE_TYPE[0]=='men') {
		if (STUDY_COND[0]=='active') {
			IMAGES_ACTIVE = IMAGES_MEN;
			IMAGES_YOKED = IMAGES_WOMEN;
		} else {
			IMAGES_ACTIVE = IMAGES_WOMEN;
			IMAGES_YOKED = IMAGES_MEN;
		}
	} else {
		if (STUDY_COND[0]=='active') {
			IMAGES_ACTIVE = IMAGES_WOMEN;
			IMAGES_YOKED = IMAGES_MEN;
		} else {
			IMAGES_ACTIVE = IMAGES_MEN;
			IMAGES_YOKED = IMAGES_WOMEN;
		}
	}
	*/

};




psiTurk.preloadPages(['setup.html',
					  'chooser.html',
					  'instruct.html',
					  'stage.html',
					  'prequestionnaire.html',
					  'postquestionnaire.html',
					  'summary.html']);

// load images defined in stimuli.js
psiTurk.preloadImages(IMAGES_SHAPES);
psiTurk.preloadImages(IMAGES_COLORS);
psiTurk.preloadImages(['static/images/fireworks.png',
					   'static/images/arrow.png',
					   'static/images/study_example_TI.png',
					   'static/images/study_example_TI_2.png']);


$('#loading').css('display', 'none');

// disable vertical bounce
$(document).bind(
      'touchmove',
          function(e) {
            e.preventDefault();
          }
);

var h = $(window).height() * .9;
if (h < STAGE_HEIGHT) {
	STAGE_HEIGHT = h;
	STAGE_WIDTH = h/STAGE_ASPECT;
}


// set study event based on user-agent
var SELECT_EVENT = (navigator.userAgent.indexOf('iPad') == -1) ? 'click' : 'touchstart';



function clear_timeouts() {
	$.each(timeouts, function(i, to) {
		clearTimeout(to);
	})
	timeouts = [];
};

function timestamp() {
	return Date.now();
	//return Math.floor(window.performance.now() || Date.now());
}


var Item = function(pars) {
	var self = this;
	self.stage = pars['stage'];
	self.ind = pars['ind'];
	self.stimid = pars['id'];
	self.id = 'item-' + self.ind;
	self.row = pars['row'];
	self.col = pars['col'];
	self.width = pars['width'];
	self.height = pars['height'];
	self.x_off = pars['x_off'] | 0;
	self.y_off = pars['y_off'] | 0;
	self.spacing_x = 100;

	self.x = (self.width + self.spacing_x) * self.row + self.x_off;
	self.y = self.height * self.col + self.y_off;
	self.framedelay = pars['framedelay'];
	self.duration = pars['duration'];
	self.img = pars['image'];
	self.blocking = pars['blocking'] | true;
	self.cond = pars['cond'];
	self.facecolor = pars['facecolor'] || '#E6E6E6';
	self.name = pars['name'];

	// item rendering
	padding_x = 50;
	padding_y = 40;
	self.obj_x = self.x + padding_x;
	self.obj_y = self.y + padding_y;
	self.obj_w = self.width - 2 * padding_x;
	self.obj_h = self.height - 2 * padding_y - 20;

	// state variables
	self.active = false;
	self.framed = false;

	// for storing study data
	self.episode = {};

	output(['item', 'id='+self.stimid, 'ind='+self.ind, 'row='+self.row,
		    'col='+self.col, 'image='+self.img, 'cond='+self.cond, 'name='+self.name]);


	self.disp = self.stage.append('g')
						  .attr('id', self.id);

	// background
	self.back = self.disp.append('rect')
						  .attr('x', self.x + padding_x/2)
						  .attr('y', self.y + padding_y/2)
						  .attr('width', self.width - padding_x)
						  .attr('height', self.height - padding_y)
						  .attr('rx', 15)
						  .attr('ry', 15)
						  .attr('fill', 'white')
						  .attr('opacity', 1.)

	self.face = self.disp.append('text')
						.text(self.word)
						.attr('x', self.obj_x + self.width/2 - padding_x)
						.attr('y', self.obj_y + self.height/2)
						.attr('text-anchor', 'middle')
						.style('font-size', '1.8em')
						.style('font-family', 'Helvetica')
						.attr('opacity', 0.)

	// the image
	self.obj = self.disp.append('image')
						.attr('x', self.obj_x)
						.attr('y', self.obj_y)
						.attr('width', self.obj_w)
						.attr('height', self.obj_h)
						.attr('opacity', 0.)
						.attr('xlink:href', self.img);

	self.nameplate = self.disp.append('text')
							  .text(self.name)
							  .attr('x', self.obj_x + self.width/2 - padding_x)
							  .attr('y', self.obj_y + self.height - padding_y - 30)
							  .attr('text-anchor', 'middle')
							  .style('font-size', '1.8em')
							  .style('font-family', 'Helvetica')
							  .style('font-weight', 'bold')
							  .attr('opacity', 0.)

	self.frame = self.disp.append('rect')
						  .attr('x', self.x + padding_x/2)
						  .attr('y', self.y + padding_y/2)
						  .attr('width', self.width - padding_x)
						  .attr('height', self.height - padding_y)
						  .attr('rx', 15)
						  .attr('ry', 15)
						  .attr('stroke-width', 3)
						  .attr('stroke', '#D8D8D8')
						  .attr('fill', 'none')
						  .attr('opacity', 0.)

	self.set_facecolor = function(col) {
		self.face.attr('fill', col);
		self.facecolor = col;
	}

	self.frame_on = function() {
		output([self.id, 'frame_highlight_on'])
		self.framed = true;
		self.frame.attr('stroke', 'red')
				  .attr('opacity', 1.);
	};

	self.frame_inactive = function() {
		output([self.id, 'frame_highlight_off'])
		self.framed = false;
		self.frame.attr('stroke', '#D8D8D8')
				  .attr('opacity', 1.);
	};

	self.frame_off = function() {
		output([self.id, 'frame_off'])
		self.framed = false;
		self.frame.attr('opacity', 0.);
	};

	self.object_on = function() {
		output([self.id, 'object_on'])
		self.framed = false;
		self.face.attr('opacity', 0.);
		self.obj.attr('opacity', 1.);
	};

	self.object_off = function() {
		output([self.id, 'object_off'])
		self.active = false;
		self.face.attr('opacity', 1.);
		self.obj.attr('opacity', 0.);
		self.nameplate.attr('opacity', 0.);
	};

	self.show = function(duration, callback) {
		//self.frame_inactive();
		self.object_on();
		to = setTimeout(function() {
			self.object_off();
			if (callback) callback();
		}, duration);
		timeouts.push(to);
	};

	self.study = function() {
		output([self.id, 'study'])

		self.object_on();

		switch (self.duration) {

			case 'none':
				break;
			case 'selfpaced':
				self.listen();
				break;
			default:
				to = setTimeout(function() {
					self.unstudy();
				}, self.duration);
				timeouts.push(to);
				break;
		};

	};

	self.unstudy = function(callback) {
		active_item = undefined;
		self.object_off();
		self.frame_inactive();
		self.episode['end_time'] = timestamp() - block_start_time;
		self.episode['duration'] = self.episode['end_time'] - self.episode['start_time'];
		output([self.id, 'episode', self.episode['start_time'], self.episode['end_time'], self.episode['duration']]);
		if (callback) callback();
	}

	self.listen = function() {

		self.disp.on(SELECT_EVENT, function() {

			// if not active, then proceed with study episode
			if (!self.active && active_item==undefined) {

				self.episode['start_time'] = timestamp() - block_start_time;

				self.active = true;
				if (self.blocking) active_item = self;

				self.frame_on();
				self.unlisten();
				//to = setTimeout(function() {
				//	self.study();
				//}, self.framedelay);
				//timeouts.push(to);

			// otherwise only handle clicks if study
			// duration is self-paced
			} else if (self.id==active_item.id && self.duration=='selfpaced') {
				self.unstudy();
			};

		});

	};

	self.listen_yoked = function() {
		self.disp.on(SELECT_EVENT, function() {
			output([self.id, 'clicked']);
			self.unlisten();
		})
	}

	self.listen_test = function(callback) {

		self.disp.on(SELECT_EVENT, function() {


			if (!self.active && active_item==undefined) {

				self.active = true;
				if (self.blocking) active_item = self;
				self.frame_on();
				setTimeout(function() {
					callback(self.stimid);
				}, 200);

			}
		});

	}


	self.unlisten = function() {
		self.disp.on(SELECT_EVENT, function() {});
	};

	self.remove = function() {
		self.disp.remove();
	}


};



function sample_options_TI(block, trial) {

	// possible options (excluding last one)
	options = range(N_ITEMS - 1);
	stimids = stimuli[block];

	// frequency with which each option has already been sampled
	freqs = _.map(stimids, function(i) { return _.filter(sampled_options[block], function(x) { return x==i; }).length });

	if (trial==0) {
		first = options.sample(1)[0];
		left = _.difference(options, [first-1, first, first+1]);
		second = left.sample(1)[0];
	} else {

		prev = sampled_options[block][trial-1];
		prev_ind = stimids.indexOf(prev);

		near_ind = _.filter(options, function(ind) {
			var dist = Math.abs(prev_ind - ind);
			return (dist == 1);
		})
		far_ind  = _.filter(options, function(ind) { return Math.abs(prev_ind - ind) > 1; })


		// filter sets to sample options that have been sampled least often so far
		near_freq = _.map(near_ind, function(i) { return freqs[i]; });
		near_ind = _.filter(near_ind, function(ind) { return freqs[ind] == _.min(near_freq); });

		far_freq = _.map(far_ind, function(i) { return freqs[i]; });
		far_ind = _.filter(far_ind, function(ind) { return freqs[ind] == _.min(far_freq); });

		first = near_ind.sample(1)[0];
		second = far_ind.sample(1)[0];

	}
	return shuffle([[stimids[first], stimids[first+1], 'near'],
				    [stimids[second], stimids[second+1], 'far']]);
}


function sample_test_trials_TI(block) {

	stimids = stimuli[block];
	all = []
	for (var b=0; b < 3; b++) {
		arr = [];
		for (var i=0; i<(N_ITEMS-1); i++) {
			for (var j=(i+1); j<N_ITEMS; j++) {
				arr.push([i, j, Math.abs(i - j)]);
			}
		};
		mb = shuffle(arr);
		all = all.concat(mb);
	}
	return _.map(all, function(test) { return [stimids[test[0]], stimids[test[1]]]; });

}


var StudyTrial = function(block, trial) {
	var self = this;
	active_item = undefined,
	self.study_cond = STUDY_COND[block];
	if (self.study_cond == 'active') {
		IMAGES = IMAGES_ACTIVE;
	} else {
		IMAGES = IMAGES_YOKED;
	}

	outpfx =['study', block, self.study_cond, trial];
	output(['init']);
	psiTurk.showPage('stage.html');
	self.above_stage = d3.select("#aboveStage");
	self.stage = d3.select('#stagesvg');
	self.stage.attr('width', STAGE_WIDTH);
	self.stage.attr('height', STAGE_HEIGHT);

	self.nrow = STUDY_NROWS;
	self.ncol = STUDY_NCOLS;
	self.items = [];
	self.stage_h = Number(self.stage.attr("height"));
	self.stage_w = self.stage_h; // square
	self.y_off = 50;
	self.x_off = (Number(self.stage.attr("width")) - self.stage_w) / 2;
	self.item_w = (self.stage_w - 140) / self.nrow;
	self.item_h = (self.stage_h - 60) / self.ncol;

	// sample options for this trial
	var pairs = sample_options_TI(block, trial);
	self.options = [pairs[0][0], pairs[1][0]];
	var dist = [pairs[0][2], pairs[1][2]];

	// the pair that comes first is on the top of the screen
	output(['option', 0, 'id='+pairs[0][0], 'id='+pairs[0][1]]);
	output(['option', 1, 'id='+pairs[1][0], 'id='+pairs[1][1]]);

	for (var i=0; i<self.nrow; i++) {
		for (var j=0; j<self.ncol; j++) {
			var stimid = pairs[j][i];
			var ind = i * self.nrow + j;
			var img = IMAGES[stimid];
			self.items.push(new Item({'stage': self.stage,
									  'id': stimid,
									  'ind': ind,
									  'row': i,
									  'col': j,
									  'y_off': self.y_off,
									  'x_off': self.x_off,
									  'width': self.item_w,
									  'height': self.item_h,
									  'image': img,
									  'framedelay': STUDY_FRAME_DELAY,
									  'duration': STUDY_DURATION,
									  'cond': self.study_cond
									 }))
		};
	};


	self.study = function() {

		$.each(self.items, function(i, item) {
			if (item.row==0) {
				item.object_on();
				item.frame_inactive();
			} else {
				item.object_off();
				item.frame_off();
			}
		});
		if (self.study_cond == 'active') {
			self.study_active();
		} else {
			self.study_random();
		}
	};


	self.study_active = function() {
		output(['active_study_begin']);
		block_start_time = timestamp();

		$.each(self.items, function(i, item) {
			if (item.row==0) {
				item.listen();
			}
		});

		self.listen_for_selection();
	};

	self.study_random = function() {
		output(['passive_study_begin']);
		block_start_time = timestamp();

		//var sel = [0, 1].sample(1)[0];
		var dist_t = ['near', 'far'][DIST_PASSIVE[trial]];
		var sel = dist.indexOf(dist_t);

		$.each(self.items, function(i, item) {
			if ((item.row==0) & (item.col==sel)) {
				item.frame_on();
				item.listen();
			}
		});

		self.listen_for_selection();
	};

	self.study_yoked = function() {
		output(['yoked_study_begin']);
		block_start_time = timestamp();

		var sel = self.options.indexOf(self.partner_selection);

		$.each(self.items, function(i, item) {
			if ((item.row==0) & (item.col==sel)) {
				item.frame_on();
				item.listen();
			}
		});

		self.listen_for_selection();

	};

	self.listen_for_selection = function() {

		var responded = false;

		if (self.study_cond=='active') {
			self.above_stage.html('Turn '+(trial+1)+'/'+N_STUDY_TRIALS+'<br />Scegli un mostro per avere informazioni.');
		} else if (self.study_cond=='yoked') {
			self.above_stage.html('Turn '+(trial+1)+'/'+N_STUDY_TRIALS+'<br />Clicca sul mostro selezionato per avere informazioni.');
		}

		// listen for any clicks
		$('#stagesvg').on(SELECT_EVENT, function(ev) {

			if (!responded) {
			// find which item is active
				$.each(self.items, function(i, item) {

					if (item.row==0 && item.active) {

						responded = true;
						self.above_stage.style('visibility', 'hidden');
						$.each(self.items, function(i, item) { item.unlisten(); });

						// record the item that was chosen
						sampled_options[block][trial] = item.stimid;
						output(['selection', item.col, 'id='+item.stimid])
						self.show_associate(i, item);

					}
				});
			}

		});

	}


	self.show_associate = function(i, item) {

		if (i==0) {
			self.items[i+1].object_off();
			self.items[i+1].frame_off();
		} else if (i==1) {
			self.items[i-1].object_off();
			self.items[i-1].frame_off();
		}


		rel = 'è meno bravo di'

		var h = self.y_off + self.item_h/2;

		self.rel = self.stage.append('text')
							.text(rel)
							.attr('x', 380)
							.attr('y', h + item.col*self.item_h - 20)
							.attr('text-anchor', 'middle')
							.style('font-size', '1em')
							.style('font-family', 'Helvetica')
							.attr('opacity', 0)


		// the image
		self.arrow = self.stage.append('image')
							.attr('x', 340)
							.attr('y', h + item.col*self.item_h - 30)
							.attr('width', 71)
							.attr('height', 143)
							.attr('xlink:href', 'static/images/arrow.png')
							.attr('opacity', 0);

		self.arrow.attr('opacity', 1);
		self.rel.attr('opacity', 1);
		self.items[i+2].object_on();
		self.items[i+2].frame_on();

		output(['show_associate', 'id='+self.items[i+2].stimid]);

		to = setTimeout(function() {
			clear_timeouts();
			exp.study();
		}, STUDY_DURATION);
		timeouts.push(to);

	}

	// short ITI
	to = setTimeout(function() {
		clear_timeouts();
		self.study();
	}, 500);
	timeouts.push(to);

};


var TITestTrial = function(block, trial) {
	var self = this;
	active_item = undefined;
	self.study_cond = STUDY_COND[block];
	if (self.study_cond == 'active') {
		IMAGES = IMAGES_ACTIVE;
	} else {
		IMAGES = IMAGES_YOKED;
	}
	outpfx =['test', block, self.study_cond, trial];

	psiTurk.showPage('stage.html');
	self.above_stage = d3.select("#aboveStage");
	self.stage = d3.select('#stagesvg');
	self.stage.attr('width', STAGE_WIDTH);
	self.stage.attr('height', STAGE_HEIGHT);
	self.stage.style('visibility', 'hidden')

	//self.stage_h = Number(self.stage.attr("height"));
	self.stage_h = STAGE_HEIGHT;
	self.stage_w = STAGE_HEIGHT; // square
	self.nrow = 2;
	self.ncol = 2;
	self.item_w = (self.stage_w - 100) / self.nrow;
	self.item_h = (STAGE_HEIGHT - 40) / self.ncol;
	self.x_off = (Number(self.stage.attr("width")) - self.stage_w) / 2;
	self.y_off = -100;
	self.target_ind = null;

	self.pair = testitems[block][trial];
	self.lower_stimid = self.pair[0];
	self.higher_stimid = self.pair[1];
	output(['options', 'lower='+self.lower_stimid, 'higher='+self.higher_stimid]);

	self.test = function() {

		self.above_stage.html('Turn '+(trial+1)+'/'+N_TEST_TRIALS+'<br />Quale dei due mostri è più bravo?')

		// randomize which side
		if (Math.random() < .5) {
			pos = [0, 1];
		} else {
			pos = [1, 0];
		}
		output(['position', 'id='+self.lower_stimid, pos[0]]);
		output(['position', 'id='+self.higher_stimid, pos[1]]);

		self.lower = new Item({'stage': self.stage,
							'id': self.lower_stimid,
							'ind': 0,
							'row': pos[0],
							'col': .5,
							'y_off': self.y_off,
							'x_off': self.x_off,
							'width': self.item_w,
							'height': self.item_h,
							'image': IMAGES[self.lower_stimid],
							'framedelay': STUDY_FRAME_DELAY,
							'duration': STUDY_DURATION,
							})


		self.higher = new Item({'stage': self.stage,
								'id': self.higher_stimid,
								'ind': 1,
								'row': pos[1],
								'col': .5,
								'y_off': self.y_off,
								'x_off': self.x_off,
								'width': self.item_w,
								'height': self.item_h,
								'image': IMAGES[self.higher_stimid],
								'framedelay': STUDY_FRAME_DELAY,
								'duration': STUDY_DURATION,
								})

		self.lower.object_on();
		self.lower.frame_inactive();

		self.higher.object_on();
		self.higher.frame_inactive();

		// listen for response
		self.lower.listen_test(self.record_response);
		self.higher.listen_test(self.record_response);
		output(['listen_for_response']);
		setTimeout(function() {
			self.stage.style('visibility', 'visible');
		}, 200);

	};

	self.record_response = function(selected) {
		var stimid = selected;
		var correct = (selected===self.higher_stimid) ? 1 : 0;
		test_accuracy[block].push(correct);
		output(['response', 'id='+self.lower_stimid, 'id='+self.higher_stimid, 'id='+selected, correct]);

		// self.next();
		setTimeout(function() { exp.test(); }, 200);
	}

	// short ITI
	to = setTimeout(function() {
		clear_timeouts();
		self.test();
	}, 500);
	timeouts.push(to);

};

var Break = function(callback) {
	psiTurk.showPage('stage.html');
	$('#aboveStage').html('Ottimo lavoro! Prima di continuare con il secondo turno, prenditi una pausa di '+
						  'qualche minuto. Per favore, stai seduto comodamente e approfitta di questa pausa '+
						  'per riposare gli occhi. Alla fine del conto alla rovescia inizierà il secondo turno.');
	display = $('#stage');
	display.css('font-size', '3em');
	startTimer(BREAK_DURATION, display, callback);
}


var PreQuestionnaire = function() {
	$('#main').html('');
	var self = this;
	psiTurk.showPage('prequestionnaire.html');
	$('#participantid').css('border', '1px solid gray');
	$('#age').css('border', '1px solid gray');
	$('#gender').css('border', '1px solid gray');

	record_responses = function() {

		psiTurk.recordTrialData(['prequestionnaire', 'submit']);

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('input').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});

		Instructions1();
	};

	$("#btn-submit").click(function() {
		$('#participantid').css('border', '1px solid gray');
		$('#age').css('border', '1px solid gray');
		$('#gender').css('border', '1px solid gray');

		var missing = false;
		if ($('#participantid').val() === "") {
			missing = true;
			$('#participantid').css('border', '1px solid red');
		};

		if ($('#age').val() === "") {
			missing = true;
			$('#age').css('border', '1px solid red');
		};

		if ($('#gender').val() === "noresp") {
			missing = true;
			$('#gender').css('border', '1px solid red');
		};

		if (!missing) {
			record_responses();
		}
	});

};


var PostQuestionnaire = function() {
	$('#main').html('');
	var self = this;
	psiTurk.showPage('postquestionnaire.html');
	//self.div = $('#container-instructions');
	//var t = '';
	//self.div.append(instruction_text_element(t));

	record_responses = function() {

		psiTurk.recordTrialData(['postquestionnaire', 'submit']);

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		Summary();
	};

	$("#btn-submit").click(function() {
		record_responses();
	});

};


var Summary = function() {
	var self = this;

	outpfx =['summary'];
	accuracy_block1 = _.reduce(test_accuracy[0], function(a,b) { return a + b; });
	accuracy_block2 = _.reduce(test_accuracy[1], function(a,b) { return a + b; });

	accuracy_pct_block1 = accuracy_block1/N_TEST_TRIALS;
	accuracy_pct_block2 = accuracy_block2/N_TEST_TRIALS;
	accuracy_pct_combined = (accuracy_block1 + accuracy_block2)/(N_TEST_TRIALS*2);

	output(['accuracy_block1', accuracy_block1, accuracy_pct_block1]);
	output(['accuracy_block2', accuracy_block2, accuracy_pct_block2]);
	output(['accuracy_combined', accuracy_block1+accuracy_block2, accuracy_pct_combined]);

	freq1 = _.map(stimuli[0], function(i) { return _.filter(sampled_options[0], function(x) { return x==i; }).length });
	freq2 = _.map(stimuli[1], function(i) { return _.filter(sampled_options[1], function(x) { return x==i; }).length });
	output(['sampled_freq_block1', freq1]);
	output(['sampled_freq_block2', freq2]);
	output(['COMPLETE']);


	psiTurk.saveData({
		success: Finish,
		error: function() {
			console.log('error saving data');
			Instructions_Finish();
		}
	});

	//setTimeout(function() {
	//	Instructions_Finish();
	//}, 1000);

};


var Finish = function() {
	// update status code of participant in database
	$.ajax({url: 'worker_complete',
			data: 'uniqueId='+uniqueId,
			type: 'GET',
			async: false,
			timeout: 10000,
			dataType: 'json',
			success: function(data) {
				output(['updated_status']);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				output(['failed to update status']);
			}
	});
	setTimeout(function() {
		if (RETEST) {
			Instructions_Retest_Finish();
		} else {
			Instructions_Finish();
		}
	}, 1000);
};


var Experiment = function(counterbalance) {
	var self = this;
	self.blocknum = -1;
	self.studytrial = -1;
	self.testtrial = -2;


	output(['version', version]);
	output(['participantid', ids[0]]);
	output(['condition', condition]);
	output(['counterbalance', counterbalance]);

	self.begin = function() {

		if (!SKIP_INSTRUCTIONS) {
			if (RETEST) {
				Instructions_Retest_Intro();
			} else {
				Instructions1();
			}
		} else {
			self.begin_block();
		}
	}


	self.begin_block = function() {
		if (SAVEDATA) psiTurk.saveData();
		self.studytrial = -1;
		self.testtrial = -2;
		self.blocknum += 1;

		if (self.blocknum < N_BLOCKS) {

			if (RETEST) {
				// straight to test
				self.test();
			} else {
				self.studycond = STUDY_COND[self.blocknum];
				if (self.studycond == 'active') {
					InstructionsActiveBlock(self.blocknum);
				} else {
					InstructionsYokedBlock(self.blocknum);
				}
			}

		} else {
			if (RETEST) {
				Summary();
			} else {
				PostQuestionnaire();
			}
		}
	}


	self.study = function() {
		self.studytrial += 1;
		if (self.studytrial < N_STUDY_TRIALS) {
			self.view = new StudyTrial(self.blocknum, self.studytrial);
		} else {
			self.test();
		}
	}


	self.test = function() {
		if (SAVEDATA) psiTurk.saveData();
		self.testtrial += 1;
		if (self.testtrial==-1) {
			if (RETEST) {
				Instructions_Retest_Block(self.blocknum);
			} else {
				InstructionsTest(self.blocknum);
			};
		} else if (self.testtrial < N_TEST_TRIALS) {
			self.view = new TITestTrial(self.blocknum, self.testtrial);
		} else {
			if (self.blocknum < (N_BLOCKS - 1)) {
				if (RETEST) {
					// skip the break for the retest
					self.begin_block();
				} else {
					self.view = new Break(self.begin_block);
				}
			} else {
				self.begin_block();
			}
		}

	};


	// STIMULI SETUP
	// yokeditems = [];

	/*
	// study data from yoked partner
	if (partner_result.length != []) {
		$.each(partner_result.partner_data, function(i, d) {
			var td = d.trialdata;
			if (td[0] == "study") {
				partnerdata.push(td);
			}
		})
	}

	partner_trial_data = {'active': [], 'yoked': []};
	yokeditems = [];


	if (!SEED) {

		$.each(['active', 'yoked'], function(i, cond) {

			ydata = _.filter(partnerdata, function(row) { return row[2]==cond; });

			console.log(ydata);

			for (var trial=0; trial<N_STUDY_TRIALS; trial++) {

				trialdata = _.filter(ydata, function(d) { return d[3]==trial; });

				options = _.filter(trialdata, function(d) { return d[4]=='option'});
				items = _.filter(trialdata, function(d) { return d[4]=='item'});
				selection = _.filter(trialdata, function(d) { return d[4]=='selection'});

				partner_trial_data[cond].push(
					{'options': [[Number(options[0][6].split('=')[1]), Number(options[0][7].split('=')[1])],
								 [Number(options[1][6].split('=')[1]), Number(options[1][7].split('=')[1])]],
					 'selection': Number(selection[0][6].split('=')[1])}
				);

			}
		});

	};*/


	if (RETEST) {
		activeitems = _.filter(prev_test_data, function(row) { return row[0]=='activeitems'})[0].slice(1,7)
		yokeditems = _.filter(prev_test_data, function(row) { return row[0]=='yokeditems'})[0].slice(1,7)
		activeimage = _.filter(prev_test_data, function(row) { return row[0]=='activeimages'})[0][1];
		if (activeimage.indexOf('shape') != -1) {
			IMAGES_ACTIVE = IMAGES_SHAPES;
			IMAGES_YOKED = IMAGES_COLORS;
		} else {
			IMAGES_ACTIVE = IMAGES_COLORS;
			IMAGES_YOKED = IMAGES_SHAPES;
		}
	} else {
		activeitems = shuffle(range(IMAGES_ACTIVE.length).sample(N_ITEMS));
		yokeditems  = shuffle(range(IMAGES_YOKED.length).sample(N_ITEMS));
	}

	if (STUDY_COND[0]=='active') {
		stimuli = [activeitems, yokeditems];
	} else {
		stimuli = [yokeditems, activeitems];
	}
	testitems = [sample_test_trials_TI(0), sample_test_trials_TI(1)];


	output(['activeitems'].concat(activeitems));
	output(['yokeditems'].concat(yokeditems));

	output(['activeimages'].concat(_.map(activeitems, function(stimid) { return IMAGES_ACTIVE[stimid]; })));
	output(['yokedimages'].concat(_.map(yokeditems, function(stimid) { return IMAGES_YOKED[stimid]; })));

	output(['testitems', 0, STUDY_COND[0]].concat(testitems[0]));
	output(['testitems', 1, STUDY_COND[1]].concat(testitems[1]));

	if (N_TEST_TRIALS===undefined) {
		N_TEST_TRIALS = testitems[0].length;
	}

	self.begin();
};

// vi: noexpandtab tabstop=4 shiftwidth=4
