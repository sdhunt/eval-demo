// Simon Hunt's Expression Evaluation Demonstrator.
//
// Inspired by
// Al Sweigart's ShowEval at https://github.com/asweigart/showeval

const PRE = 0;
const BEFORE = 1;
const AFTER = 2;
const POST = 3;

const FADE_TIME = 150;
const ANIM_STEP = 350;

const cooked = [];
let step = 0;

const addControls = title => {
  const label = $('<span>').addClass('label').text(title);
  const buttons = $('<span>').addClass('buttons');

  buttons
    .append(button('Next Step', nextStep))
    .append(button('Reset', reset));

  $('header').append(label).append(buttons);

};

const button = (text, action) => {
  const btn = $('<button>').text(text);
  btn.click(action);
  return btn;
};

const addProlog = lines => {
  if ($.isArray(lines)) {
      lines.forEach(line => addLine(line, 'prolog'));
  }
};

const addLine = (text, cls) => {
  const div = $('<div>').addClass('show-eval').addClass(cls);
  div.append(span(text));
  $('section').append(div);
};

const reset = () => {
  $('main').empty();
  showStep(0);
  step = 0;
}

const nextStep = () => {
  if (step < cooked.length) {
    let div = showStep(step, true);
    animateEval(div, step);
    step += 1;
  }
}

const showStep = (num, inRed) => {
  const div = $('<div>').addClass('show-eval');
  const cls = inRed ? 'eval red' : 'eval';
  div.append(span(cooked[num][PRE]))
     .append(span(cooked[num][BEFORE], cls))
     .append(span(cooked[num][POST]));
  div.hide();
  $('main').append(div);
  fadeIn(div);
  return div;
};


const animateEval = (div, step) => {
  const after = cooked[step][AFTER];
  const evalSpan = div.children('.eval')
  animSequence(ANIM_STEP,
    beat,
    beat,
    () => fadeOut(evalSpan),
    () => replaceText(evalSpan, after),
    () => fadeIn(evalSpan),
    beat,
    () => blacken(evalSpan),
  );
};

// ======

const beat = () => undefined;

const fadeIn = elem => {
  elem.fadeTo(FADE_TIME, 1);
};

const fadeOut = elem => {
  elem.fadeTo(FADE_TIME, 0);
};

const replaceText = (span, text) => {
  const newW = getWidth(text);
  span.animate({width: newW, duration: FADE_TIME}, () => span.text(text));
};

const blacken = (span) => {
  span.removeClass('red');
};

const animSequence = (pauseMs, ...fns) => {
  if (fns.length) {
    const fn = fns.shift();
    fn();
    window.setTimeout(() => animSequence(pauseMs, ...fns), pauseMs);
  }
}

const span = (t, cls) => {
  const s = $('<span>').text(t);
  if (cls) {
    s.addClass(cls);
  }
  return s;
};

const getWidth = text => {
  const tmp = $('<span>').addClass('show-eval').hide().text(text);
  $('body').append(tmp);
  const width = tmp.width();
  tmp.remove();
  return width + 1; // fudge
};

const prepareData = data => {
  const regex = /(.*){(.*)}{(.*)}(.*)/;
  data.forEach(d => {
    const match = regex.exec(d);
    cooked.push([match[1], match[2], match[3], match[4]]);
  });
};


// Export prepare() method to global hook
sdhEvalLib = {
  prepare: (title, data, prolog) => {
    addControls(title);
    addProlog(prolog);
    prepareData(data);
    reset();
  }
};
