(function () {
  'use strict';

  // MyCity_UI not there yet (this page came up first, or the kit is restarting)
  if (!window.MC) { setTimeout(function () { location.reload(); }, 1000); return; }
  // which kit the page was built on
  if (!MC.needs) console.error('[ox_target] MyCity_UI trop ancien : restart MyCity_UI, puis ox_target.');
  else MC.needs('1.7.121', 'ox_target');

  var resource = window.GetParentResourceName ? window.GetParentResourceName() : 'ox_target';
  var body = document.body;
  var eye = document.getElementById('eye');
  var menu = document.getElementById('options');

  eye.appendChild(MC.icon('hand'));

  function select(type, id, zoneId) {
    fetch('https://' + resource + '/select', {
      method: 'post',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify([type, id, zoneId]),
    }).catch(function (err) {
      console.error('[ox_target] select : ' + err);
    });
  }

  function addOption(type, data, id, zoneId) {
    if (data.hide) return;

    var icon = MC.el('span', { class: 'mc-menu-icon mc-menu-icon--plain' }, [
      data.icon ? MC.el('i', { class: 'fa-fw ' + data.icon }) : null,
    ]);
    if (data.iconColor) icon.style.color = data.iconColor;

    // the label is written as text: it can hold a player's name
    var option = MC.el('button', { class: 'mc-menu-item', type: 'button' }, [
      icon,
      MC.el('span', { text: data.label == null ? '' : String(data.label) }),
    ]);

    option.addEventListener('click', function () {
      // when nuifocus is disabled after a click, the hover event is never released
      option.style.pointerEvents = 'none';
      select(type, id, zoneId);
      setTimeout(function () { option.style.pointerEvents = 'auto'; }, 100);
    });

    menu.appendChild(option);
  }

  function clearOptions() {
    menu.textContent = '';
    menu.hidden = true;
  }

  window.addEventListener('message', function (event) {
    var data = event.data || {};
    clearOptions();

    switch (data.event) {
      case 'visible':
        body.style.visibility = data.state ? 'visible' : 'hidden';
        eye.classList.remove('mc-target--on');
        return;

      case 'leftTarget':
        eye.classList.remove('mc-target--on');
        return;

      case 'setTarget':
        eye.classList.add('mc-target--on');

        // an option's id is its place in the list the game sent, hidden ones included
        if (data.options) {
          Object.keys(data.options).forEach(function (type) {
            if (!Array.isArray(data.options[type])) return;
            data.options[type].forEach(function (option, i) {
              addOption(type, option, i + 1);
            });
          });
        }

        if (data.zones) {
          data.zones.forEach(function (zone, z) {
            zone.forEach(function (option, i) {
              addOption('zones', option, i + 1, z + 1);
            });
          });
        }

        menu.hidden = !menu.firstChild;
        return;
    }
  });
})();
