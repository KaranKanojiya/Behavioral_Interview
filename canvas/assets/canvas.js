/* ============================================================
   Behavioral Interview Canvas — Shared Interactive Layer
   Vanilla JS, no dependencies. Each behaviour is opt-in.
   ============================================================ */
(function () {
  'use strict';
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // ---- tabs ----
  function initTabs() {
    $$('.tabs').forEach(function (tabs) {
      var scope = tabs.closest('[data-tabscope]') || document;
      tabs.addEventListener('click', function (e) {
        var t = e.target.closest('.tab'); if (!t) return;
        var id = t.getAttribute('data-tab');
        $$('.tab', tabs).forEach(function (x) { x.classList.toggle('active', x === t); });
        $$('.tabpanel', scope).forEach(function (p) { p.classList.toggle('active', p.getAttribute('data-panel') === id); });
      });
    });
  }

  // ---- collapsibles ----
  function initCollapsibles() {
    $$('.collapsible > .c-head').forEach(function (h) {
      h.addEventListener('click', function () { h.parentElement.classList.toggle('open'); });
    });
  }

  // ---- checklists (click to toggle done) ----
  function initChecklists() {
    $$('.checklist li').forEach(function (li) {
      li.addEventListener('click', function () { li.classList.toggle('done'); });
    });
  }

  // ---- STAR Builder ----
  // Requires markup with #star-builder, textareas #sb-s, #sb-t, #sb-a, #sb-r, (#sb-l optional)
  // and #sb-total, #sb-feedback, #sb-preview.
  function initSTARBuilder() {
    var wrap = document.getElementById('star-builder');
    if (!wrap) return;

    var fields = [
      { id: 'sb-s', label: 'Situation', target: 15, tone: 's' },
      { id: 'sb-t', label: 'Task',      target: 15, tone: 't' },
      { id: 'sb-a', label: 'Action',    target: 65, tone: 'a' },
      { id: 'sb-r', label: 'Result',    target: 15, tone: 'r' },
      { id: 'sb-l', label: 'Learnings', target: 10, tone: 'l' }
    ];

    // Roughly 150 words per minute spoken pace.
    function wordCount(t) { return t.trim() ? t.trim().split(/\s+/).length : 0; }
    function speakSeconds(words) { return Math.round(words / 2.5); }

    function refresh() {
      var totalWords = 0;
      var perField = {};
      fields.forEach(function (f) {
        var el = document.getElementById(f.id);
        if (!el) { perField[f.id] = 0; return; }
        var w = wordCount(el.value);
        perField[f.id] = w;
        totalWords += w;
      });

      var totalSec = speakSeconds(totalWords);
      var totalEl = $('#sb-total');
      if (totalEl) {
        var mm = Math.floor(totalSec / 60);
        var ss = totalSec % 60;
        totalEl.innerHTML =
          '<b>' + totalWords + '</b> words &middot; ~<b>' +
          mm + ':' + (ss < 10 ? '0' : '') + ss + '</b> spoken' +
          (totalSec > 180 ? ' <span style="color:var(--warn)">(too long — trim to under 2:30)</span>' :
           totalSec >= 90 && totalSec <= 150 ? ' <span style="color:var(--ok)">(ideal 90-150s)</span>' :
           totalSec < 60 ? ' <span style="color:var(--warn)">(too short — add detail)</span>' : '');
      }

      // Per-field breakdown with target %
      var feedback = $('#sb-feedback');
      if (feedback) {
        var lines = [];
        fields.forEach(function (f) {
          var w = perField[f.id];
          if (w === 0) { lines.push('<div><span class="star-tag ' + f.tone + '">' + f.label[0] + '</span> ' + f.label + ': <span style="color:var(--faint)">empty</span></div>'); return; }
          var pct = totalWords ? Math.round(w / totalWords * 100) : 0;
          var diff = pct - f.target;
          var status;
          if (Math.abs(diff) <= 10) status = '<span style="color:var(--ok)">on target</span>';
          else if (diff > 10)  status = '<span style="color:var(--warn)">' + Math.abs(diff) + '% too long</span>';
          else                 status = '<span style="color:var(--warn)">' + Math.abs(diff) + '% too short</span>';
          lines.push('<div><span class="star-tag ' + f.tone + '">' + f.label[0] + '</span> ' + f.label + ': <b>' + pct + '%</b> (target ~' + f.target + '%) &middot; ' + w + ' words &middot; ' + status + '</div>');
        });

        // "I" vs "we" ratio check
        var actionEl = document.getElementById('sb-a');
        if (actionEl && actionEl.value.trim()) {
          var text = ' ' + actionEl.value.toLowerCase() + ' ';
          var iCount = (text.match(/\bi\b|\bi'|\bmy\b|\bme\b/g) || []).length;
          var weCount = (text.match(/\bwe\b|\bwe'|\bour\b|\bus\b/g) || []).length;
          var ratio = weCount === 0 ? (iCount > 0 ? '\u221E' : 'n/a') : (iCount / weCount).toFixed(1);
          var ratioColor = weCount === 0 && iCount > 0 ? 'var(--ok)' : (iCount >= weCount * 2 ? 'var(--ok)' : (iCount >= weCount ? 'var(--quest)' : 'var(--warn)'));
          lines.push('<div style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--border)"><b>Action pronoun check:</b> "I"/"my" = ' + iCount + ', "we"/"our" = ' + weCount + ' &middot; ratio = <b style="color:' + ratioColor + '">' + ratio + '</b> <span style="color:var(--faint)">(aim for 2:1 or higher — show YOUR contribution)</span></div>');
        }

        // Result metric check
        var resultEl = document.getElementById('sb-r');
        if (resultEl && resultEl.value.trim()) {
          var hasNum = /\d/.test(resultEl.value);
          var hasPct = /%|percent/i.test(resultEl.value);
          var hasUnit = /(ms|sec|min|hour|day|week|month|year|\$|k\b|m\b|users?|team|customer|ticket|incident|deployment|release|line)/i.test(resultEl.value);
          var checks = [];
          checks.push((hasNum ? '<span style="color:var(--ok)">\u2713</span>' : '<span style="color:var(--warn)">\u2717</span>') + ' has numbers');
          checks.push((hasPct ? '<span style="color:var(--ok)">\u2713</span>' : '<span style="color:var(--faint)">\u2717</span>') + ' has %');
          checks.push((hasUnit ? '<span style="color:var(--ok)">\u2713</span>' : '<span style="color:var(--warn)">\u2717</span>') + ' has business unit');
          lines.push('<div style="margin-top:4px"><b>Result quantification:</b> ' + checks.join(' &middot; ') + '</div>');
        }

        feedback.innerHTML = lines.join('');
      }

      // Preview render
      var preview = $('#sb-preview');
      if (preview) {
        var parts = [];
        fields.forEach(function (f) {
          var el = document.getElementById(f.id);
          if (!el || !el.value.trim()) return;
          parts.push('<div style="margin:8px 0"><span class="star-tag ' + f.tone + '">' + f.label[0] + '</span><b>' + f.label + '</b><br>' + escapeHtml(el.value) + '</div>');
        });
        preview.innerHTML = parts.length ? parts.join('') : '<div style="color:var(--faint);font-size:13px">Fill in the fields above to see your story preview.</div>';
      }
    }

    fields.forEach(function (f) {
      var el = document.getElementById(f.id);
      if (el) el.addEventListener('input', refresh);
    });

    var clearBtn = $('#sb-clear');
    if (clearBtn) clearBtn.addEventListener('click', function () {
      if (!confirm('Clear all STAR fields?')) return;
      fields.forEach(function (f) {
        var el = document.getElementById(f.id);
        if (el) el.value = '';
      });
      refresh();
    });

    var loadEx = $('#sb-load-example');
    if (loadEx) loadEx.addEventListener('click', function () {
      var ex = {
        's': 'On the search platform team, we were migrating from Elasticsearch 5 to Elasticsearch 7. Our search served 200M requests/day and any regression would hit revenue directly.',
        't': 'I was tech lead for the migration. The goal was to complete it in 6 weeks with zero query regressions and no downtime for 3 downstream services.',
        'a': 'I started by cataloging every query pattern across the 3 consumer services and built a shadow-traffic harness that replayed production queries against both clusters. When I found that 4% of queries returned different result orderings, I dug into the changelog and identified the BM25 scoring change as the cause. I proposed a compatibility layer that pinned the old scoring for legacy queries while new queries used BM25. I paired with each consumer team for two afternoons to migrate their queries and set up per-team dashboards showing latency and result diffs. When one PM pushed to skip the compatibility layer, I shared the shadow-traffic data showing a 12% CTR drop on the affected surface and we kept the layer. I ran the cutover in three staged waves so we could roll back per-service.',
        'r': 'We completed the migration 4 days ahead of schedule with zero customer-visible regressions. Query p99 latency dropped from 340ms to 180ms (47% improvement). The shadow-traffic harness I built has since been reused for 3 other infrastructure migrations across the org.',
        'l': 'I learned that shadow traffic is worth building even for "safe" migrations — it caught issues that unit tests never would. I would have started the consumer-team pairing earlier; leaving it until week 3 created a rush at the end.'
      };
      Object.keys(ex).forEach(function (k) {
        var el = document.getElementById('sb-' + k);
        if (el) el.value = ex[k];
      });
      refresh();
    });

    refresh();
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ---- Story Bank (localStorage-backed) ----
  var STORY_KEY = 'behavioralCanvasStoryBank_v1';
  var CATEGORIES = [
    'Conflict Resolution',
    'Failure & Learning',
    'Leadership & Initiative',
    'Ambiguity & Decisions',
    'Customer Obsession',
    'Impact & Results',
    'Teamwork & Collaboration'
  ];

  function loadStories() {
    try {
      var raw = localStorage.getItem(STORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function saveStories(list) {
    try { localStorage.setItem(STORY_KEY, JSON.stringify(list)); } catch (e) {}
  }

  function initStoryBank() {
    var wrap = document.getElementById('story-bank');
    if (!wrap) return;

    var listEl = $('#sb-list');
    var covEl  = $('#sb-coverage');
    var stories = loadStories();

    function render() {
      // list
      if (stories.length === 0) {
        listEl.innerHTML = '<div style="color:var(--faint);font-size:13px;padding:14px;border:1px dashed var(--border);border-radius:10px;text-align:center">No stories yet. Add your first story above.</div>';
      } else {
        listEl.innerHTML = stories.map(function (s, i) {
          var cats = (s.categories || []).map(function (c) { return '<span class="pill quest">' + escapeHtml(c) + '</span>'; }).join('');
          return '<div class="story-card">' +
            '<div class="st-head"><div class="st-title">' + escapeHtml(s.title || 'Untitled') + '</div>' +
              '<div class="st-meta">' + escapeHtml(s.when || '') + '</div></div>' +
            (s.oneLiner ? '<div class="st-body">' + escapeHtml(s.oneLiner) + '</div>' : '') +
            '<div>' + cats + '</div>' +
            '<div style="margin-top:8px;display:flex;gap:6px"><button class="btn warn" data-del="' + i + '">Delete</button></div>' +
          '</div>';
        }).join('');
        $$('[data-del]', listEl).forEach(function (b) {
          b.addEventListener('click', function () {
            var idx = parseInt(b.getAttribute('data-del'), 10);
            if (confirm('Delete "' + (stories[idx].title || 'story') + '"?')) {
              stories.splice(idx, 1); saveStories(stories); render();
            }
          });
        });
      }

      // coverage
      if (covEl) {
        var counts = {};
        CATEGORIES.forEach(function (c) { counts[c] = 0; });
        stories.forEach(function (s) {
          (s.categories || []).forEach(function (c) { if (counts.hasOwnProperty(c)) counts[c]++; });
        });
        covEl.innerHTML = CATEGORIES.map(function (c) {
          var n = counts[c];
          var cls = n >= 2 ? 'ok' : (n === 1 ? '' : 'warn');
          return '<div class="cov-row">' +
            '<span class="cov-label">' + c + '</span>' +
            '<span class="cov-count ' + cls + '">' + n + ' ' + (n === 1 ? 'story' : 'stories') + '</span>' +
          '</div>';
        }).join('');
      }
    }

    // Build category checkboxes for the add-form
    var catBox = $('#sb-cat-box');
    if (catBox) {
      catBox.innerHTML = CATEGORIES.map(function (c, i) {
        return '<label style="display:inline-flex;align-items:center;gap:4px;margin:4px 8px 4px 0;font-size:12.5px;color:var(--muted);cursor:pointer">' +
          '<input type="checkbox" value="' + escapeHtml(c) + '" data-cat> ' + c +
        '</label>';
      }).join('');
    }

    var addBtn = $('#sb-add');
    if (addBtn) addBtn.addEventListener('click', function () {
      var title = ($('#sb-title') || {}).value || '';
      var when  = ($('#sb-when')  || {}).value || '';
      var one   = ($('#sb-one')   || {}).value || '';
      if (!title.trim()) { alert('Story title is required.'); return; }
      var cats = $$('#sb-cat-box input[data-cat]:checked').map(function (c) { return c.value; });
      stories.push({ title: title, when: when, oneLiner: one, categories: cats, ts: Date.now() });
      saveStories(stories);
      $('#sb-title').value = ''; $('#sb-when').value = ''; $('#sb-one').value = '';
      $$('#sb-cat-box input[data-cat]:checked').forEach(function (c) { c.checked = false; });
      render();
    });

    var clearBtn = $('#sb-clear-all');
    if (clearBtn) clearBtn.addEventListener('click', function () {
      if (stories.length === 0) return;
      if (!confirm('Delete ALL ' + stories.length + ' stories? This cannot be undone.')) return;
      stories = []; saveStories(stories); render();
    });

    var exportBtn = $('#sb-export');
    if (exportBtn) exportBtn.addEventListener('click', function () {
      if (stories.length === 0) { alert('No stories to export.'); return; }
      var data = JSON.stringify(stories, null, 2);
      var blob = new Blob([data], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = 'story-bank.json';
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
    });

    render();
  }

  // ---- LP Quiz (given a question, guess the Leadership Principle) ----
  function initLPQuiz() {
    var wrap = document.getElementById('lp-quiz');
    if (!wrap) return;

    var deck = [
      { q: 'Tell me about a time you went above and beyond for a customer or end user.', lp: 'Customer Obsession' },
      { q: 'Tell me about a time you took ownership of something outside your area of responsibility.', lp: 'Ownership' },
      { q: 'Tell me about a time you simplified a complex system or process.', lp: 'Invent and Simplify' },
      { q: 'Tell me about a time your team members disagreed with your approach but you went with it anyway and were right.', lp: 'Are Right, A Lot' },
      { q: 'Tell me about a time you learned a new technology or skill to solve a problem.', lp: 'Learn and Be Curious' },
      { q: 'Tell me about a time you mentored someone and it helped their career.', lp: 'Hire and Develop the Best' },
      { q: 'Tell me about a time you received negative feedback and how you responded.', lp: 'Insist on the Highest Standards' },
      { q: 'Tell me about your most ambitious project.', lp: 'Think Big' },
      { q: 'Tell me about a time you made a tough decision without consulting anybody.', lp: 'Bias for Action' },
      { q: 'Tell me about a time you accomplished a goal with limited resources.', lp: 'Frugality' },
      { q: 'Tell me about a time you admitted you were wrong.', lp: 'Earn Trust' },
      { q: 'Tell me about a time you found a root cause that others missed.', lp: 'Dive Deep' },
      { q: 'Tell me about a time your teammate or manager did not agree with you. What did you do?', lp: 'Have Backbone; Disagree and Commit' },
      { q: 'Tell me about a time you couldn\u2019t meet your deadline. What happened?', lp: 'Deliver Results' },
      { q: 'Tell me about a time you improved the work environment for your team.', lp: 'Strive to be Earth\u2019s Best Employer' },
      { q: 'Tell me about a time you considered the broader impact of your technical decision.', lp: 'Success and Scale Bring Broad Responsibility' }
    ];

    var allLPs = deck.map(function (d) { return d.lp; });
    var score = 0, total = 0, current = null;

    function pick() {
      current = deck[Math.floor(Math.random() * deck.length)];
      // build 4 options: correct + 3 distractors
      var opts = [current.lp];
      while (opts.length < 4) {
        var cand = allLPs[Math.floor(Math.random() * allLPs.length)];
        if (opts.indexOf(cand) === -1) opts.push(cand);
      }
      // shuffle
      opts.sort(function () { return Math.random() - 0.5; });

      $('#lpq-question').textContent = '\u201C' + current.q + '\u201D';
      var optWrap = $('#lpq-options');
      optWrap.innerHTML = '';
      opts.forEach(function (o) {
        var b = document.createElement('button');
        b.className = 'btn';
        b.style.display = 'block';
        b.style.width = '100%';
        b.style.textAlign = 'left';
        b.style.margin = '6px 0';
        b.textContent = o;
        b.addEventListener('click', function () { answer(b, o); });
        optWrap.appendChild(b);
      });
      $('#lpq-feedback').innerHTML = '';
      $('#lpq-next').style.display = 'none';
    }

    function answer(btn, choice) {
      total++;
      var correct = choice === current.lp;
      if (correct) {
        score++;
        btn.style.borderColor = 'var(--ok)';
        btn.style.color = 'var(--ok)';
        $('#lpq-feedback').innerHTML = '<div style="color:var(--ok);font-size:13.5px;padding:8px 0"><b>\u2713 Correct!</b> This maps to <b>' + current.lp + '</b>.</div>';
      } else {
        btn.style.borderColor = 'var(--warn)';
        btn.style.color = 'var(--warn)';
        $('#lpq-feedback').innerHTML = '<div style="color:var(--warn);font-size:13.5px;padding:8px 0"><b>\u2717 Not quite.</b> The primary LP is <b>' + current.lp + '</b>.</div>';
      }
      $$('#lpq-options .btn').forEach(function (b) { b.disabled = true; });
      $('#lpq-score').innerHTML = '<b>Score:</b> ' + score + ' / ' + total + ' (' + Math.round(score / total * 100) + '%)';
      $('#lpq-next').style.display = 'inline-block';
    }

    $('#lpq-next').addEventListener('click', pick);
    $('#lpq-reset').addEventListener('click', function () {
      score = 0; total = 0;
      $('#lpq-score').innerHTML = '<b>Score:</b> 0 / 0';
      pick();
    });
    pick();
  }

  // ---- Level Calibration comparator (Mid / Senior / Staff toggle) ----
  function initLevelToggle() {
    var wrap = document.getElementById('level-toggle');
    if (!wrap) return;

    function setLevel(level) {
      $$('#level-toggle .btn').forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-level') === level);
      });
      $$('[data-level-panel]').forEach(function (p) {
        p.style.display = p.getAttribute('data-level-panel') === level ? '' : 'none';
      });
    }

    $$('#level-toggle .btn').forEach(function (b) {
      b.addEventListener('click', function () { setLevel(b.getAttribute('data-level')); });
    });
    setLevel('senior');
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTabs();
    initCollapsibles();
    initChecklists();
    initSTARBuilder();
    initStoryBank();
    initLPQuiz();
    initLevelToggle();
  });
})();
